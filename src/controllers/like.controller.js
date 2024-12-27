import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;

  if (!videoId) throw new apiError(400, "Video id is missing!!");

  const videoLike = await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (!videoLike)
    throw new apiError(500, "Something went wrong, while liking the video :(");

  return res
    .status(200)
    .json(new apiResponse(201, videoLike, "Video liked successfully :)"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment

  const { commentId } = req.params;
  if (!commentId) throw new apiError(400, "Comment id is missing!!");

  const commentLike = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });
  if (!commentLike)
    throw new apiError(
      500,
      "Something went wrong, while liking the comment :("
    );

  return res
    .status(200)
    .json(new apiResponse(201, commentLike, "Comment liked successfully :)"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  const { tweetId } = req.params;
  if (!tweetId) throw new apiError(400, "Tweet id is missing!!");

  const tweetLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });
  if (!tweetLike)
    throw new apiError(500, "Something went wrong, while liking the tweet :(");

  return res
    .status(200)
    .json(new apiResponse(201, tweetLike, "Tweet liked successfully :)"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const likedVideo = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideo",
      },
    },
    {
      $unwind: "$video",
    },
  ]);

  if (!likedVideo || likedVideo.length === 0)
    throw new apiError(
      500,
      "Something went wrong, while fetching liked videos :("
    );

  return res
    .status(200)
    .json(
      new apiResponse(201, likedVideo, "Liked video fetched successfully :)")
    );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
