import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.cookies);
    const encodedToken =
      req.cookies?.userAccessToken ||
      req.header.authorization?.replace("Bearer ", "");

    if (!encodedToken) {
      throw new ApiError(400, "Unauthorised request");
    }

    const decodedToken = jwt.verify(
      encodedToken,
      process.env.ACCESSTOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(400, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      next(new ApiError(401, "Invalid or expired token"));
    } else {
      next(new ApiError(400, error.message));
    }
  }
});

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const encodedToken =
      req.cookies?.adminAccessToken ||
      req.header.authorization?.replace("Bearer ", "");
    if (!encodedToken) {
      throw new ApiError(400, "Unauthorised admin");
    }

    const decodedToken = jwt.verify(
      encodedToken,
      process.env.ACCESSTOKEN_SECRET
    );

    req.admin = decodedToken;
    next();
  } catch (error) {
    console.error("Admin token verification error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

export { verifyJWT, verifyAdminJWT };
