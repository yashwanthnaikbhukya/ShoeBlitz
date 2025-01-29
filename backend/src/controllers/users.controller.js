import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res) => {
  // take inputs from users
  // check the fields,
  // check if user exists
  // create new user
  try {
    const { username, email, password } = req.body;

    if (
      [username, email, password].some(
        (field) => field == null || field?.trim() == ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(404, "User already existed");
    }

    const user = await User.create({
      username,
      email,
      password,
    });
    const createdUser = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, "User created Successfully", createdUser));
  } catch (error) {
    res.status(error.statusCode).json(error.message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // take user input
  // check fields
  // check if user is registered or not
  // Check password
  // generate accesstoken
  // store in cookie and send res
  try {
    const { email, password } = req.body;

    if (
      [email, password].some((field) => field == null || field?.trim() == "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(400, "User is not registered");
    }

    const isPassWordValid = await user.isPassWordCorrect(password);

    if (!isPassWordValid) {
      throw new ApiError(400, "Password is incorrect");
    }

    const userAccessToken = await user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    // const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    return res
      .status(200)
      .cookie("userAccessToken", userAccessToken, options)
      .json(new ApiResponse(200, "login successful", loggedInUser));
  } catch (error) {
    res.status(error.statusCode).json(error.message);
  }
});

const isLoggedIn = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User is logged in", {
      isloggedIn: true,
      user: req.user,
    })
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies

  const username = req.user.username;

  return res
    .status(200)
    .clearCookie("userAccessToken", options)
    .json(new ApiResponse(200, `${username} logged out successfully`));
});

export { registerUser, loginUser, logoutUser, isLoggedIn };
