import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userAllUrl } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/urls", verifyJWT, userAllUrl);

export default router;
