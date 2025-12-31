import { Router } from "express";
import { createUser, deleteUser } from "../controllers/user.controller.js";

const router =  Router();

router.route("/createuser").post(createUser)
router.route("/deleteuser").post(deleteUser)

export default router;