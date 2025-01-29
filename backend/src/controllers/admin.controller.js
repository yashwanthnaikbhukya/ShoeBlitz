import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import JWT from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 60 * 60 * 1000,
};

const generateAdminToken = async function ({ username, password }) {
  return JWT.sign(
    {
      username,
      password,
    },
    process.env.ACCESSTOKEN_SECRET,
    { expiresIn: process.env.ACCESSTOKEN_EXPIRY }
  );
};

const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;
    if (
      [username, password].some((field) => field == null || field.trim() == "")
    ) {
      throw new ApiError(400, "Enter all credentials");
    }

    if (
      !(
        username == process.env.ADMIN_USERNAME &&
        password == process.env.ADMIN_PASSWORD
      )
    ) {
      throw new ApiError(400, "Invalid admin credentials");
    }

    const adminAccessToken = await generateAdminToken({ username, password });

    // const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    return res
      .status(200)
      .cookie("adminAccessToken", adminAccessToken, options)
      .json(new ApiResponse(200, "admin successfully logged in"));
  } catch (error) {
    res.status(error.statusCode).json(error.message);
  }
});

const adminLogout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("adminAccessToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export { adminLogin, adminLogout };
