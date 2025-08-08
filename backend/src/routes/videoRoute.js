import express from "express";
import { generateFolderName, getAllFolders, getFilesByFolder, uploadChunk  } from "../controllers/folderController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import uploadFile from "../middleware/multer.js";



const router = express.Router();
 
router.post("/generate-folder", protectRoute, generateFolderName);
router.post("/upload-chunks", protectRoute, uploadFile, uploadChunk);
router.get("/get-chunks", protectRoute, getFilesByFolder);
router.get("/get-all-folders", protectRoute, getAllFolders);


export default router;