import express from "express";
import { redirectUrl } from "../controllers/redirecturl.controllers.js";

const router = express.Router();

router.get("/:shorturl", redirectUrl);

export default router;
