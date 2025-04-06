import express from 'express';
import { authRouter } from './auth.route.js';
import { profileRouter } from './profile.route.js';
import { taskRouter } from './tast.routes.js';
import { kidRouter } from './kid.routes.js';

const router = express.Router();

// Auth Router
router.use("/auth",authRouter)

// Profile Router
router.use("/profile",profileRouter)

// task Router
router.use("/task",taskRouter)

// Kid Router
router.use("/kid",kidRouter)

export { router };

