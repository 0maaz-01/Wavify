import express from "express";
import { generateFolderName, getChunks, uploadChunk  } from "../controllers/folderController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate-folder", protectRoute, generateFolderName);
router.post("/upload-chunks", protectRoute, uploadChunk);
router.get("/get-chunks", protectRoute, getChunks);


// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;