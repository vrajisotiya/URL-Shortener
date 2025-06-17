import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import { errorHandler } from "./utils/errorHandler.js";
import shortUrl from "./routes/shorturl.routes.js";
import redirectUrl from "./routes/redircturl.routes.js";
import auth from "./routes/auth.routes.js";
import userUrl from "./routes/user.routes.js";

app.use("/api/v1/auth", auth);
app.use("/api/v1/create", shortUrl);
app.use("/api/v1/redirect", redirectUrl);
app.use("/api/v1/user", userUrl);

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

export { app };
