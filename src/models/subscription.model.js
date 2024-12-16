import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new mongoose.schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,  // one who subscribe the channel
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,  // one whose being subscribed to
            ref: "User"
        }
    }, 
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);