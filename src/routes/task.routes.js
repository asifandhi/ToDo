import { Router } from "express";
import {
  changeThestatusOfTask,
  createTask,
  deleteTask,
  GetTaskAccordingToRequirement,
  getTaskById,
} from "../controllers/task.controller.js";

const router = Router();

router.route("/createtask").post(createTask);
router.route("/:taskId/deletetask").post(deleteTask);
router.route("/:taskId/gettask").post(getTaskById);
router.route("/gettasksaccordingto").post(GetTaskAccordingToRequirement);
router.route("/:taskId/changethestatus").post(changeThestatusOfTask);

export default router;
