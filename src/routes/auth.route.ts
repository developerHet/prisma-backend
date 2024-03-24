import express, { Request, Response } from "express";
import { validateData } from "../middleware/validation.middleware";
import {
  resetPasswordSchema,
  userRegistrationSchema,
} from "../schemas/user.schema";
import {
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
} from "../controller/auth.controller";
import { protect } from "../middleware/auth.middleware";

const regi = (req: Request, res: Response) => {};
const router = express.Router();

router.post("/register", validateData(userRegistrationSchema), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:resetToken",
  validateData(resetPasswordSchema),
  resetPassword
);
router.get("/getme", protect, getMe);

export default router;
