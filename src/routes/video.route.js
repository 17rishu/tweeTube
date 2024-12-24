import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/publishAVideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/getAllVideos").get(getAllVideos);
router.route("/getVideoById/:videoId").get(getVideoById);
router.route("/updateVideo/:videoId").patch(updateVideo);
router.route("/deleteVideo/:videoId").post(deleteVideo);
router.route("/togglePublishStatus/:videoId").post(togglePublishStatus);

export default router;