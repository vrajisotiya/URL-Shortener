import express from "express";
import {
  createShortUrl,
  deleteUrl,
  toggleActiveUrl,
} from "../controllers/shorturl.controllers.js";
import { attachUser } from "../middlewares/attachuser.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", attachUser, createShortUrl);
router.patch("/toggle/active/:shorturl", verifyJWT, toggleActiveUrl);
router.delete("/:shorturl", verifyJWT, deleteUrl);

export default router;
