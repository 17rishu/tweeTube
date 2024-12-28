import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/getChannelStats").get(getChannelStats);
router.route("/getChannelVideos").get(getChannelVideos);

export default router;
