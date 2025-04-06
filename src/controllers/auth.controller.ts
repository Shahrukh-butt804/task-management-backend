import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { cookieOptions } from "../config/constant.js";

const signup = asyncHandler(
  async (req: Request, res: Response , next : NextFunction): Promise<any> => {

    // return next({ statusCode: 400, message: "Mera Error" });

    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ fullName, email, password, role });
    await newUser.save();

    newUser.password = "";
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  }
);

const login = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user: any = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        status: 200,
        success: true,
        message: "user Logged In successfully!",
        user: user,
        accessToken, // its a good practice to send token from here as well this will be benifitial
        refreshToken,
      });
  }
);



const logout = asyncHandler(
  async (req: any, res: Response): Promise<any> => {

   await User.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: null } },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "User logged out successfully" });
  }
);

const forgetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Generate 4 digits OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    await user.save();
    console.log(otp);

    // send Otp



    return res
      .status(200)
      .json({ message: "Otp has been sent to your Email" , otp});
  }
);

const verifyOtp = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {

    const { email,otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.otp !== otp){
      return res.status(404).json({ message: "Invalid Otp" });
    }

    return res
      .status(200)
      .json({ message: "Otp Verified Successfully"});
  }
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {

    const { email,otp ,password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.otp !== otp){
      return res.status(404).json({ message: "Invalid Otp" });
    }

    user.password = password;
    user.otp = null;
    await user.save();

    return res
      .status(200)
      .json({ message: "password updated successfully"});
  }
);

const changePassword = asyncHandler(
  async (req: any, res: Response): Promise<any> => {

    const {password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    return res
      .status(200)
      .json({ message: "password updated successfully"});
  }
);





export { signup, login,logout,forgetPassword,verifyOtp ,resetPassword ,changePassword};
