import express from 'express';
import { forgetPassword, login, logout, resetPassword, signup ,verifyOtp,changePassword} from '../controllers/auth.controller.js';
import { validateUserForSignup } from '../validations/user.validation.js';
import { handleValidationErrors } from '../middlewares/handleValidationErrors.js';
import { verifyJWT } from '../middlewares/auth.Middle.js';

const authRouter = express.Router();

authRouter.route("/signup").post(validateUserForSignup,handleValidationErrors,signup);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(verifyJWT,logout);

authRouter.route("/forgetPassword").post(forgetPassword);
authRouter.route("/verifyOtp").post(verifyOtp);
authRouter.route("/resetPassword").post(resetPassword);
authRouter.route("/changePassword").post(verifyJWT,changePassword);

export {authRouter}