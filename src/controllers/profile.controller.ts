import { Response } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateProfile = asyncHandler(
  async (req: any, res: Response): Promise<any> => {
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName;
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  }
);

const getMyProfile = asyncHandler(
  async (req: any, res: Response): Promise<any> => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Profile fetched successfully!",
      user: user,
    });
  }
);

export { getMyProfile, updateProfile };
