import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
