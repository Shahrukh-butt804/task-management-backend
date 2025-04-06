import { Request, Response } from "express";
import { Kid } from "../models/kid.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createKid = asyncHandler(async (req: any, res: any): Promise<any> => {
  const user = req?.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parent = await User.findById(user?._id);

  if (!parent) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { fullName, username, age, gender, password } = req.body;

  const kid = await Kid.create({
    parent: parent._id,
    fullName,
    username,
    age,
    gender,
    password,
  });

  if (!kid) {
    return res.status(500).json({ message: "Kid not created" });
  }

  parent.kids.push(kid?._id);

  await parent.save({ validateBeforeSave: false });

  res
    .status(201)
    .json({ message: "Kid registered successfully", success: true, kid });
});

const getMyKids = asyncHandler(async (req: any, res: any): Promise<any> => {
  const user = req?.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parent = await User.findById(user?._id).populate("kids");

  if (!parent) {
    return res.status(500).json({ message: "internal server Error" });
  }

  res.status(200).json({
    message: "Kid Fetched successfully",
    success: true,
    kids: parent.kids,
  });
});

const kidLogin = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const kid: any = await Kid.findOne({ username });
    if (!kid) {
      return res.status(404).json({ message: "kid not found" });
    }

    // const isPasswordValid = await user.isPasswordCorrect(password);

    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid password" });
    // }

    // const accessToken = user.generateAccessToken();
    // const refreshToken = user.generateRefreshToken();

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, cookieOptions)
        // .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
          status: 200,
          success: true,
          message: "user Logged In successfully!",
          kid,
          // accessToken, // its a good practice to send token from here as well this will be benifitial
          // refreshToken,
        })
    );
  }
);
export { createKid, getMyKids, kidLogin };
