import { Url } from "../models/url.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const redirectUrl = asyncHandler(async (req, res) => {
  const { shorturl } = req.params;

  const url = await Url.findOne({ shortUrl: shorturl });

  if (!url) {
    throw new ApiError(404, "The requested short URL does not exist.");
  }

  if (!url.isActive) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, {}, "This URL has been deactivated or deleted.")
      );
  }

  if (url.expiresAt && Date.now() > new Date(url.expiresAt)) {
    return res
      .status(410)
      .json(new ApiResponse(410, {}, "This URL has expired."));
  }

  if (url.maxClicks && url.clicks >= url.maxClicks) {
    console.log(url.clicks + " " + url.maxClicks);
    return res
      .status(410)
      .json(
        new ApiResponse(
          410,
          {},
          "This URL has reached its maximum allowed clicks"
        )
      );
  }

  url.clicks += 1;
  await url.save();

  res.redirect(302, url.fullUrl);
});

export { redirectUrl };
