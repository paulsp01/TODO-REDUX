import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/verifyJwt.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/get-users", authenticate, getAllUser);
router.get("/profile/:userId", authenticate, getUserProfile);
router.post("/logout", authenticate, logoutUser);

export default router;