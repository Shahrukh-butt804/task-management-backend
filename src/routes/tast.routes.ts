import { Router } from "express";
import { assignTask, myTask } from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.Middle.js";

const taskRouter = Router();

taskRouter.route("/my-task").get(verifyJWT,myTask);
taskRouter.route("/assign-task").post(verifyJWT,assignTask);

export { taskRouter };
