import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).array("chunk");

export default uploadFile;
