import { Router } from "express";
import {AdminRole} from "../constants/api.js";
import { checkRoles } from "../middlewares/auth.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.put("/premium/:uid", checkRoles([AdminRole]) ,UserController.modifyUser);

export { router as userRouter}