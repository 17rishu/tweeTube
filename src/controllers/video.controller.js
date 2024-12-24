import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    filter.ownerId = userId;
  }

  const sort = {};
  
  sort[sortBy] = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalVideos = await Video.countDocuments(filter);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { videos, totalVideos, page, limit },
        "Videos retrieved successfully :)"
      )
    );
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

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  // console.log(videoFile)

  if (!videoFile || !thumbnail)
    throw new apiError(500, "Something went wrong, while uploading :(");

  const ownerDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
  ]);

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    ownerId: ownerDetails[0]._id,
    ownerUsername: ownerDetails[0].username,
  });
  // console.log(video)

  return res
    .status(200)
    .json(new apiResponse(201, video, "Video uploaded successfully :)"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  // get the videoId from req.params
  // check if videoId is valid
  // find the video by videoId
  // return the detail in res

  const { videoId } = req.params;

  if (!videoId) throw new apiError(404, "Video does not exist :(");

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video does not exist :(");

  return res
    .status(201)
    .json(new apiResponse(201, video, "Video found successfully :)"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  // get videoId from req.params
  // get title/description/thumbnail from req.body
  // check if videoId is valid
  // check if title/description/thumbnail is provided
  // update the video details
  // return the updated video details in res

  const { videoId } = req.params;

  if (!videoId) throw new apiError(404, "Video does not exist :(");

  const { title, description, thumbnail } = req.body;

  if (!title && !description && !thumbnail)
    throw new apiError(404, "Title/Description/Thumbnail is required!!");

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail,
      },
    },
    {
      new: true,
    }
  );

  if (!video) throw new apiError(404, "Video does not exist :(");

  return res
    .status(201)
    .json(new apiResponse(201, video, "Video updated successfully :)"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  // get videoId from req.params
  // check if videoId is valid
  // delete teh video
  // return the success message in res

  const { videoId } = req.params;

  if (!videoId) throw new apiError(404, "Video does not exist :(");

  const video = await Video.findByIdAndDelete(videoId, {
    new: true,
  });

  if (!video) throw new apiError(404, "Video does not exist :(");

  return res
    .status(201)
    .json(new apiResponse(201, {}, "Video deleted successfully :)"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // get the id from req.params
  // check if videoId is valid
  // update publish toggle to opposite, if its true turn false vice versa
  // return the video res

  const { videoId } = req.params;

  if (!videoId) throw new apiError(404, "Video does not exist :(");

  const video = await Video.findById(videoId);

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(201)
    .json(
      new apiResponse(
        200,
        video,
        "Video publish toggle status is switched successfully :)"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};