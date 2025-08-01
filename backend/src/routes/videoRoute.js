import express from "express";
import { generateFolderName, getAllFolders, getChunks, uploadChunk  } from "../controllers/folderController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate-folder", protectRoute, generateFolderName);
router.post("/upload-chunks", protectRoute, uploadChunk);
router.get("/get-chunks", protectRoute, getChunks);
router.get("/video/get-all-folders", protectRoute, getAllFolders);


export default router;