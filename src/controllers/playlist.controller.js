import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist

  const { name, desc } = req.body;

  if (!name || !desc)
    throw new apiError(
      400,
      "Name and description is required for creating a playlist!!"
    );

  // const videos = await Video.find({ ownerId: req.user._id });
  //   console.log(videos[0].videoFile);

  const playlist = await Playlist.create({
    name,
    desc,
    ownerId: req.user._id,
    ownerUsername: req.user.username,
  });

  if (!playlist) throw new apiError(400, "Playlist not found!!");

  return res
    .status(200)
    .json(new apiResponse(201, playlist, "Playlist created successfully :)"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists

  const { userId } = req.params;

  if (!userId) throw new apiError(404, "User Id is missing!!");

  const userPlaylists = await Playlist.find({ ownerId: userId });

  if (!userPlaylists || userPlaylists.length === 0)
    throw new apiError(404, "No playlist found :(");

  const totalPlaylists = await Playlist.countDocuments({ ownerId: userId });
  //   console.log(totalPlaylists)

  return res
    .status(201)
    .json(
      new apiResponse(
        200,
        { userPlaylists, totalPlaylists },
        "All playlists fetched successfully :)"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id

  const { playlistId } = req.params;

  if (!playlistId) throw new apiError(400, "Playlist Id is missing!!");

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new apiError(404, "No playlist found :(");

  return res
    .status(200)
    .json(new apiResponse(201, playlist, "Playlist fetched successfully :)"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // retrieve playlistId and videoId from req.params
  // check if they are provided and correct
  // add that video in the videos array
  // check if added correctly
  // return res

  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId)
    throw new apiError(400, "Playlist id and video id both are needed!!");

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video not found!!");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: { videos: videoId },
    },
    { new: true }
  ).populate("videos");

  if (!playlist)
    throw new apiError(
      500,
      "Something went wrong, while adding video in playlist :("
    );

  return res
    .status(201)
    .json(
      new apiResponse(200, playlist, "Video added to playlist successfully :)")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  // take playlist and videoId from req.params
  // check if both ids are valid and present
  // remove video from playlist
  // return the remaining playlist

  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId)
    throw new apiError(400, "Playlist id and video id both are required!!");

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video not found :(");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  ).populate("videos");

  if (!playlist)
    throw new apiError(
      500,
      "Something went wrong, while removing video from playlist :("
    );

  return res
    .status(200)
    .json(
      new apiResponse(
        201,
        playlist,
        "Video removed from playlist successfully :)"
      )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist

  const { playlistId } = req.params;
  const { name, desc } = req.body;

  if (!playlistId) throw new apiError(400, "Playlist id is missing!!");

  if (!name && !desc)
    throw new apiError(400, "Name or description is needed!!");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        desc,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist)
    throw new apiError(500, "Something went wrong, while updating playlist :(");

  return res
    .status(201)
    .json(new apiResponse(200, playlist, "Playlist updated successfully :)"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist

  const { playlistId } = req.params;

  if (!playlistId) throw new apiError(400, "Playlist id is missing!!");

  const playlist = await Playlist.findByIdAndDelete(playlistId, {
    new: true,
  });

  if (!playlist)
    throw new apiError(500, "Something went wrong, while deleting playlist :(");

  return res
    .status(201)
    .json(new apiResponse(200, playlist, "Playlist deleted successfully :)"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
