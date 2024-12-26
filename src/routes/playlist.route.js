import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.use(verifyJWT);

router.route("/createPlaylist").post(createPlaylist);
router.route("/getUserPlaylists/:userId").get(getUserPlaylists);
router.route("/getPlaylistById/:playlistId").get(getPlaylistById);
router
  .route("/addVideoToPlaylist/:playlistId/:videoId")
  .post(addVideoToPlaylist);
router
  .route("/removeVideoFromPlaylist/:playlistId/:videoId")
  .post(removeVideoFromPlaylist);
router.route("/updatePlaylist/:playlistId").patch(updatePlaylist);
router.route("/deletePlaylist/:playlistId").post(deletePlaylist);

export default router;
