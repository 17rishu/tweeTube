import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  // take the title, desc, video from user
  // check if all, are provided
  // upload on cloudinary
  // check if uploaded successfully
  // return the cloudinary link in res

  const { title, description } = req.body;

  if (!title || !description)
    throw new apiError(404, "Title/Description is required!!");

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoFileLocalPath) throw new apiError(404, "video file is missing :(");

  if (!thumbnailLocalPath) throw new apiError(404, "thumbnail is missing :(");

  const videoFile = await uploadOnCloudinary(videoFileLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  // console.log(videoFile)

  if(!videoFile || !thumbnail)  throw new apiError(500, "Something went wrong, while uploading :(")
  
  const ownerDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    }
  ])

  const video = await Video.create(
    {
      title, 
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      duration: videoFile.duration,
      ownerId: ownerDetails[0]._id,
      ownerUsername: ownerDetails[0].username
    }
  )
  // console.log(video)

  return res
  .status(200)
  .json(
    new apiResponse(201, video, "Video uploaded successfully :)")
  )
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
