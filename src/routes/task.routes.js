import { Router } from "express";
import { createTask, deleteTask, getTaskById } from "../controllers/task.controller.js";

const router =  Router();

router.route("/createtask").post(createTask)
router.route("/:taskId/deletetask").post(deleteTask)
router.route("/:taskId/gettask").post(getTaskById)


export default router;