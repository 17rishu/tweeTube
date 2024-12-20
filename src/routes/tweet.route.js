import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.use(verifyJWT); // apply verfiyJWT middleware to all routes in this file

router.route("/createTweet").post(createTweet);
router.route("/getUserTweets").get(getUserTweets);
router.route("/updateTweet/:tweetId").patch(updateTweet);
router.route("/deleteTweet/:tweetId").post(deleteTweet);

export default router;
