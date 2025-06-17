import { nanoid } from "nanoid";
import { Url } from "../models/url.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createShortUrl = asyncHandler(async (req, res) => {
  const { url, slug, expiresAt, maxClicks } = req.body;

  if (!url || url.trim() === "") {
    throw new ApiError(400, "URL is required");
  }

  if (slug) {
    if (!req.user?._id) {
      throw new ApiError(403, "Authentication required for custom slugs");
    }

    const existing = await Url.findOne({ shortUrl: slug });

    if (existing) {
      throw new ApiError(409, "This custom url is already taken");
    }

    const newUrl = await Url.create({
      fullUrl: url.trim(),
      shortUrl: slug,
      owner: req.user?._id,
      expiresAt: expiresAt || undefined,
      maxClicks: maxClicks || undefined,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          process.env.APP_URL + "api/v1/redirect/" + slug,
          "Url created successfully"
        )
      );
  } else {
    const shortUrl = nanoid(7);
    const newUrl = await Url.create({
      fullUrl: url.trim(),
      shortUrl,
      owner: req.user?._id || undefined,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          process.env.APP_URL + "api/v1/redirect/" + shortUrl,
          "Url created successfully"
        )
      );
  }
});

const toggleActiveUrl = asyncHandler(async (req, res) => {
  const { shorturl } = req.params;

  const url = await Url.findOne({ shortUrl: shorturl });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  url.isActive = !url.isActive;

  await url.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, url, "Url Activated status updated successfully")
    );
});

const deleteUrl = asyncHandler(async (req, res) => {
  const { shorturl } = req.params;

  const url = await Url.findOneAndDelete({ shortUrl: shorturl });

  if (url) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Url deleted successfully"));
  }

  throw new ApiError(404, "Url not found");
});

export { createShortUrl, toggleActiveUrl, deleteUrl };
