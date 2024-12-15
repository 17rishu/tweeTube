import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "chai pe code ki charchaa!!",
  // });

  // get user data from frontend
  // validation - not empty
  // check if user exists already : username, email
  // check for images, avatar
  // upload them to cloudinary - avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  // console.log(`Email: ${email}`);
  console.log(req.body);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All field are required!!");
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) throw new apiError(409, "username/email already exists!!");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log(req.files);

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new apiError(400, "Avatar file is required!!");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new apiError(400, "Avatar file is required!!");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  console.log(user);

  const userCreated = await User.findById(user._id).select(
    "-passsword -refreshToken"
  );

  console.log(userCreated);

  if (!userCreated)
    throw new apiError(500, "My Bad :( , Something went wrong from our end!!");

  return res
    .status(201)
    .json(new apiResponse(200, userCreated, "User registered successfully :)"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> body
  // find user through username/email
  // check password
  // if all good and user exist in our DB, then
  // generate access and refresh token
  // send it via secure cookie
  // and respond with success message also.

  const { username, email, password } = req.body;
  console.log(username, email, password);

  if (!username && !email)
    throw new apiError(400, "email or username required :(");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new apiError("404", "user not found :(");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new apiError("401", "invalid credentials!!");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Logged in successfully :)"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(200, {}, "User logged out!");
});

export { registerUser, loginUser, logoutUser };
