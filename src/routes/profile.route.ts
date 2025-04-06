import express from 'express';
import { getMyProfile, updateProfile } from '../controllers/profile.controller.js';
import { verifyJWT } from '../middlewares/auth.Middle.js';

const profileRouter = express.Router();

profileRouter.route("/updateProfile").post(verifyJWT,updateProfile);
profileRouter.route("/myProfile").get(verifyJWT,getMyProfile);

export { profileRouter };

