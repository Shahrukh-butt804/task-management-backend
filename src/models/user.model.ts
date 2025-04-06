import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  refreshToken: string | null;
  otp: string | null;
  createdAt: Date;
  updatedAt: Date;
  kids : any[]
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    kids : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "Kid"
    }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const expiresIn: any = process.env.ACCESS_TOKEN_EXPIRY || "60d";
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn }
    );
  } catch (error) {
    console.log("error while creating Access token", error);
    throw error;
  }
};

userSchema.methods.generateRefreshToken = function () {
  const expiresIn: any = process.env.REFRESH_TOKEN_EXPIRY || "15m";
  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn }
    );
  } catch (error) {
    console.log("error while creating Refresh token", error);
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
