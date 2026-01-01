import { Router } from "express";
import { createUser, deleteUser, GetUser } from "../controllers/user.controller.js";

const router =  Router();

router.route("/createuser").post(createUser)
router.route("/deleteuser").post(deleteUser)
router.route("/getuser").post(GetUser)

export default router;