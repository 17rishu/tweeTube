import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggleSubscription/:channelId").post(toggleSubscription);
router
  .route("/getUserChannelSubscribers/:channelId")
  .get(getUserChannelSubscribers);
router.route("/getSubscribedChannels/:subscriberId").get(getSubscribedChannels);

export default router;
