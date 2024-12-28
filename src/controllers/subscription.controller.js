import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  // get channelId, basically userId from req.params
  // check if it's valid
  // toggle the isSubscribed value to true if false otherwise vice versa
  // return the success message with all details

  const { channelId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new apiError(400, "Invalid channel ID!!");
  }

  let subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (subscription) {
    subscription.isSubscribed = !subscription.isSubscribed;
    await subscription.save();
  } else {
    subscription = await Subscription.create({
      channel: channelId,
      subscriber: userId,
      isSubscribed: true,
    });
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        subscription,
        "Subscription status toggled successfully :)"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new apiError(400, "Invalid channel ID!!");
  }

  const subscribers = await Subscription.find({
    channel: channelId,
    isSubscribed: true,
  }).populate("subscriber", "username");

  if (!subscribers) throw new apiError(400, "No subscriber found :(");

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
    isSubscribed: true,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { subscribers, totalSubscribers },
        "Subscribers fetched successfully :)"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new apiError(400, "Invalid subscriber ID");
  }

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
    isSubscribed: true,
  }).populate("channel", "username");

  if (!subscriptions) throw new apiError(400, "No subscriptions found :(");

  const totalChannelsSubscribed = await Subscription.countDocuments({
    subscriber: subscriberId,
    isSubscribed: true,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { subscriptions, totalChannelsSubscribed },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
