import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // default 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || "1000", 10),
  message: { success: false, message: "Too many requests from this IP" },
});
