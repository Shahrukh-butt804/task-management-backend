import { Router } from "express";
import { createKid, getMyKids, kidLogin } from "../controllers/kid.controller.js";
import { verifyJWT } from "../middlewares/auth.Middle.js";

const kidRouter = Router();

kidRouter.route("/create").post(verifyJWT,createKid);
kidRouter.route("/get-my-kids").get(verifyJWT,getMyKids);
kidRouter.route("/kidLogin").post(kidLogin);
export { kidRouter };

