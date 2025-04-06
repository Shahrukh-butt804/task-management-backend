import express from "express";
import path from "path";

const testingRouter = express.Router();
const serverStartTime = new Date();

testingRouter.get("/", (req, res) => {
    res.sendFile(path.join("public", "index.html"));
});
testingRouter.get("/test", (req, res) => {
    res.send(`server is running on ${process.env.PORT}`)
});

testingRouter.get("/server-time", (req, res) => {
    res.json({ startTime: serverStartTime });
});

export { testingRouter };

