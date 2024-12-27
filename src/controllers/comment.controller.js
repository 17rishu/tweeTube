import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  const { videoId } = req.params;
  // const { page = 1, limit = 3 } = req.query;

  if (!videoId) throw new apiError(400, "Video id is missing!!");

  const allComments = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "allComments",
      },
    },
  ]);
  // console.log(allComments)
  if (!allComments)
    throw new apiError(
      500,
      "Something went wrong, while fetching all comments for this video :("
    );

  // const skip = (page - 1) * limit;

  // const video = await Video.findById(videoId);

  // if (!video) throw new apiError(404, "Video not found :(");

  // const totalComments = video.allComments.length;
  // const comments = video.allComments.slice(skip, skip + limit);

  return res
    .status(200)
    .json(
      new apiResponse(
        201,
        allComments,
        "All comments fetched successfully :)"
      )
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  // take videoId from req.params
  // check if videoId is valid
  // retrieve comment from req.body
  // check if comment is provided
  // add comment to video
  // return relevant response

  const { videoId } = req.params;
  if (!videoId) throw new apiError(400, "Video id is missing!!");
  // console.log(videoId);

  const { content } = req.body;
  if (!content) throw new apiError(400, "Content is required!!");
  // console.log(content)

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(400, "Video not found!!");
  // console.log(video)

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });
  // console.log(comment)

  if (!comment)
    throw new apiError(
      500,
      "Something went wrong, while adding comment to video :("
    );

  return res
    .status(200)
    .json(
      new apiResponse(200, comment, "Comment added to video successfully :)")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  // take commentId from req.params
  // check if its valid
  // retrieve comment content from req.body
  // check if comment is provided
  // update the comment
  // return res

  const { commentId } = req.params;
  if (!commentId) throw new apiError(400, "Comment id is missing!!");

  const { content } = req.body;
  if (!content) throw new apiError(400, "Comment content is required!!");

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );
  if (!comment)
    throw new apiError(
      500,
      "Something went wrong, while updating comment to the video :("
    );

  return res
    .status(201)
    .json(new apiResponse(200, comment, "Comment updated successfully :)"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { commentId } = req.params;
  if (!commentId) throw new apiError(400, "Comment id is missing!!");

  const deletedComment = await Comment.findByIdAndDelete(commentId, {
    new: true,
  });
  if (!deletedComment)
    throw new apiError(500, "Something went wrong, while deleting comment :(");

  return res
    .status(200)
    .json(
      new apiResponse(201, deletedComment, "Comment deleted successfully :)")
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
