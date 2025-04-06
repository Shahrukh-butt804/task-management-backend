import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const myTask = asyncHandler(async (req: any, res) => {
  const { _id } = req?.user;

  if (!_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const tasks = await Task.find({ createdBy: _id });

  res.status(200).json({
    message: "task fetched successfully!",
    tasks,
  });
});

const assignTask = asyncHandler(async (req: any, res) => {
  const user = req?.user;

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const userFound = await User.findById(user._id);

  if (!userFound || userFound.role !== "admin") {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { title, description, assignTo, priority, status, dueDate, createdBy ,compensation} =
    req.body;
  //   console.log(title, description, assignTo, priority, status, dueDate , createdBy ,compensation);

  const task = await Task.create({
    createdBy,
    title,
    description,
    assignTo,
    priority,
    status,
    dueDate,
    compensation
  });

  if (!task) {
    return res.status(400).json({
      message: "Task not created",
    });
  }

  res.status(200).json({
    success: true,
    message: "task created successfully!",
    task,
  });
});

export { myTask, assignTask };
