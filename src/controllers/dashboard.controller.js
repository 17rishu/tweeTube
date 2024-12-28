import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import moment from "moment";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  // get total video views from Video
  // get total subscriber from Subscription
  // get all video from Video
  // get total likes from Like

  const userId = req.user?._id;

  if (!userId) throw new apiError(404, "User not found!!");

  const user = await User.findById(userId).select("createdAt")

  const totalViews = await Video.find({ ownerId: userId }).select(
    "views ownerUsername"
  );

  if (!totalViews) throw new apiError(500, "No views found :(");

  const totalSubscribers = await Subscription.find({
    channel: userId,
  }).countDocuments({ channel: userId, isSubscribed: true});

  if(!totalSubscribers) throw new apiError(404, "No subscriber found :(")

  const totalVideos = await Video.find({ownerId: userId}).countDocuments({ownerId: userId})

  if(!totalVideos)  throw new apiError(404, "No Video found :(")

  const totalLikes = await Like.find({ likedBy: userId }).countDocuments({
    likedBy: userId,
  });

  if(!totalLikes) throw new apiError(404, "No likes found :(")

  const channelCreatedAt = moment(user.createdAt).format("DD/MM/YYYY hh:mm A")

  return res
    .status(201)
    .json(
      new apiResponse(
        200,
        {
          totalViews,
          totalSubscribers,
          totalVideos,
          totalLikes,
          channelCreatedAt,
        },
        "Channel Stats fetched successfully :)"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  // get all videos from Video

  const userId = req.user?._id

  if(!userId) throw new apiError(400, "User not found!!")

  const allVideos = await Video.find({ownerId: userId})

  if(!allVideos)  throw new apiError(404, "No video found :(")

  return res
  .status(201)
  .json(
    new apiResponse(200, allVideos, "All videos fetched :)")
  )

});

export { getChannelStats, getChannelVideos };
