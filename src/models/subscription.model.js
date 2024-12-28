import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who subscribe the channel
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one whose being subscribed to
      ref: "User",
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
