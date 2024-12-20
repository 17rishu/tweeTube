import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req, res) => {
  // retrieve tweet content from req.body
  // validate tweet content
  // make an entry in tweet DB
  // connect the logged in user to its tweet as owner of tweet
  // check if user connected successfully
  // return relevant response to user

  const { content } = req.body;

  if (!content) throw new apiError(200, "Tweet content missing :(");

  const ownerDetails = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
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

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) throw new apiError(500, "Tweet creation failed :(");

  const owner = ownerDetails[0].username;

  return res
    .status(200)
    .json(
      new apiResponse(201, { content, owner }, "Tweet posted successfully :)")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
  // add a array of tweets to user model
  // check if user has any tweet
  // retrieve all tweets of user
  // return relevant response to user

  const allTweets = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "tweets",
        localField: "_id",
        foreignField: "owner",
        as: "allTweets",
      },
    },
    {
      $project: {
        allTweets: 1,
      },
    },
  ]);

  if (allTweets.length === 0) throw new apiError(404, "Tweet not found :(");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { allTweets },
        "User's all tweets retrieved successfully :)"
      )
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  // retrieve data from req.body
  // check updated tweet is present, if not throw error
  // update the old tweet with new tweet
  // send the new tweet in res

  const { newContent } = req.body;
  const { tweetId } = req.params;

  if (!newContent) throw new apiError(404, "Tweet is required!!");

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: newContent,
      },
    },
    {
      new: true,
    }
  );

  if (!tweet) throw new apiError(400, "Tweet not found :(");

  return res
    .status(200)
    .json(new apiResponse(201, tweet, "Tweet updated successfully :)"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // get the tweetId
  // check if it exist
  // delete it from DB
  // send success message

  const { tweetId } = req.params;

  const tweet = await Tweet.findByIdAndDelete(tweetId, {
    new: true,
  });

  if (!tweet) throw new apiError(404, "Tweet not found!!");

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Tweet deleted successfully!!"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
