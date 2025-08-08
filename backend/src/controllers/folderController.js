import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";


let folderName = "default";


export const generateFolderName = (req, res) => {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  folderName = `${date}_${time}`;

  res.status(201).json({ folderName });
};



export function generateFileName(req, res) {
    const now = new Date();

    const pad = (n) => String(n).padStart(2, '0');
    
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    const fol = `${date}_${time}`
    
    res.status(201).json(fol);
    return `${date}_${time}`
}







export async function getAllFolders() {
  try {
    const user = req.user;
    const result = await cloudinary.api.sub_folders(user.email); // e.g. 'user@example.com'

    return {
      success: true,
      folders: result.folders.map(folder => folder.name), // or full_path if needed
    };
  } 
  catch (error) {
    console.error('Error fetching folders:', error);
    return {
      success: false,
      message: 'Failed to retrieve folders',
      error,
    };
  }
}





export async function getFilesByFolder(folderName) {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${userEmail}/${folderName}`, // Folder path
      max_results: 100,
    });

    return {
      success: true,
      files: result.resources,
    };
  } 
  catch (error) {
    console.error('Error fetching files:', error);
    return {
      success: false,
      message: 'Failed to retrieve files',
      error,
    };
  }
}






export async function uploadChunk(req, res) {

  const user = req.user;
  const file = req.files;

  console.log(file)
  console.log(user)

  const fileUrl = getDataurl(file);

  const name = generateFileName()

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
      folder : `${user.email}/${folderName}/${name}`
  });

  console.log(cloud.public_id)

  res.json({
    message: "Chunk Uploaded",

  });
};