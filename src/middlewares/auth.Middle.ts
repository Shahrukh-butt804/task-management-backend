import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// Extend Request to include a `user` property
interface AuthenticatedRequest extends Request {
  user?: any; // Adjust this to match your User model type
}

export const verifyJWT = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token){
        res.status(401).json({
            status: 401,
            message: "Unauthorized request",
        })
      };

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload; 

      if (!decodedToken._id){
        res.status(401).json({
            status: 401,
            message: "Invalid Access Token",
        })
      };

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        res.status(401).json({
            message:"User not found or token invalid"
        })
      };

      req.user = user; // Attach user to request
      next();
    } catch (error: any) {
      console.error("JWT Verification Error:", error);
      res.status(500).json({
        message :"JWT Verification Error"
      });
    }
  }
);
