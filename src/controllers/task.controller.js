import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";

const createTask = AsyncHandler(async (req, res) => {
  const { name, title, priority } = req.body;
  if ([name, title, priority].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "Name, title, and priority are required");
  }
  const user = await User.findOne({ name: name.toLowerCase() });
  if (!user) {
    throw new ApiError(400, "User does not exist...");
  }

  const task = await Task.create({
    title: title,
    status: "todo",
    priority: priority,
    taskCreator: user?._id,
  });

  if (!task) {
    throw new ApiError(400, "Task not created ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task created sucessully..."));
});

const deleteTask = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const { taskId } = req.params;

  if (!name || !taskId) {
    throw new ApiError(200, "Name and Task id is required...");
  }
  const user = await User.findOne({ name: name.toLowerCase() });
  if (!user) {
    throw new ApiError(400, "User does not exist...");
  }

  const delete_task = await Task.findOneAndDelete({
    _id: taskId,
    taskCreator: user._id,
  });
  if (!delete_task) {
    throw new ApiError(400, "can not delete Task...");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "task deleted  sucessully..."));
});

const getTaskById = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  const { taskId } = req.params;

  if (!name || !taskId) {
    throw new ApiError(200, "Name and Task id is required...");
  }
  const user = await User.findOne({ name: name.toLowerCase() });
  if (!user) {
    throw new ApiError(400, "User does not exist...");
  }

  const task = await Task.findOne({
    _id: taskId,
    taskCreator: user._id,
  });
  if (!task) {
    throw ApiError(400, "Task doent fetched");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "task fetched   sucessully..."));
});

const GetTaskAccordingToRequirement = AsyncHandler(async (req, res) => {
    const { name, index } = req.body;

    if (!name || name.trim() === "") {
        throw new ApiError(400, "Please enter the name");
    }

    if (index < -1 || index > 2) {
        throw new ApiError(400, "Index must be -1, 0, 1, or 2");
    }

    const user = await User.findOne({ name });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const states = ["todo", "in-progress", "done"];
    let tasks;

    if (index === -1) {
        tasks = await Task.find({
            taskCreator: user._id
        }).select("-createdAt -updatedAt");
    } 
    // 🔹 Get tasks by status
    else {
        tasks = await Task.find({
            taskCreator: user._id,
            status: states[index]
        }).select("-createdAt -updatedAt");
    }

    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found");
    }

    const countsAgg = await Task.aggregate([
        {
            $match: {
                taskCreator: user._id
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // 🔹 FORMAT COUNTS
    const counts = {
        todo: 0,
        "in-progress": 0,
        done: 0
    };

    countsAgg.forEach(item => {
        counts[item._id] = item.count;
    });

    return res.status(200).json(
        new ApiResponse(200, {tasks,counts}, "Tasks fetched successfully")
    );
});


const changeThestatusOfTask = AsyncHandler(async (req, res) => {
  const { name, index } = req.body;
  const { taskId } = req.params;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Name is required");
  }

  const user = await User.findOne({ name });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const states = ["in-progress", "done"];
  if (index < 0 || index > 1) {
    throw new ApiError(400, "Index must be 0 or 1");
  }

  const statusToChange = states[index];

  const task = await Task.findOne({
    _id: taskId,
    taskCreator: user._id,
    status: { $in: ["todo", "in-progress"] },
  });

  if (!task) {
    throw new ApiError(
      400,
      "Task cannot be updated. It may already be completed or does not exist."
    );
  }

  task.status = statusToChange;
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

export {
  createTask,
  deleteTask,
  getTaskById,
  GetTaskAccordingToRequirement,
  changeThestatusOfTask,
};
