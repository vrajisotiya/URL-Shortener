import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Url } from "../models/url.models.js";
import { ApiError } from "../utils/ApiError.js";

const userAllUrl = asyncHandler(async (req, res) => {
  const allUrl = await Url.find({ owner: req.user?._id });

  if (!allUrl || allUrl.length === 0) {
    throw new ApiResponse(200, {}, "No URLs found");
  }

  return res.status(200).json(new ApiResponse(200, allUrl, "All URLs found"));
});

export { userAllUrl };
