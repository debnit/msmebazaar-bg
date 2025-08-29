import { Router } from "express";
import multer from "multer";
import { uploadKyc } from "../controllers/kyc.controller";
import { jwtMw } from "@msmebazaar/shared/auth";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(jwtMw(process.env.JWT_SECRET || "", true));

router.post(
  "/kyc",
  upload.fields([
    { name: "panDocument", maxCount: 1 },
    { name: "gstDocument", maxCount: 1 },
  ]),
  uploadKyc
);

export default router;
