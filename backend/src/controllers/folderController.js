import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";



let folderName = "default";


export function generateFolderName() {
    const now = new Date();

    const pad = (n) => String(n).padStart(2, '0');
    
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    folderName = `${date}_${time}`;
}



export function generateFileName() {
    const now = new Date();

    const pad = (n) => String(n).padStart(2, '0');
    
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    return `${date}_${time}`;
}






export async function uploadChunk(req, res) {

  const user = req.user;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const name = generateFileName()

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
      folder : `${user.email}/${folderName}/${name}`
  });

  res.json({
    message: "Chunk Uploaded",
  });
};






export async function getChunks(req, res) {

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  res.json({
    message: "Chunk Uploaded",
  });
};






const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

cloudinary.uploader.upload("path/to/your/file.jpg", {
  folder: "my_folder"
})
.then(result => console.log(result))
.catch(error => console.error(error));
