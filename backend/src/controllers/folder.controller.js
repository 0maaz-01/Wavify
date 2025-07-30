import { Folder } from "../models/Folder.js";
import { Song } from "../models/Song.js";
import getDataurl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";




export function generateFolderName() {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, '0');
  
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  return `${date}_${time}`;
}





const cloudinary = require("cloudinary").v2;

router.post("/upload", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString(); // get the user ID

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `user_uploads/${userId}`, // use the user ID in folder name
    });

    res.json({ success: true, url: result.secure_url });
  } 
  catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});





export async function uploadChunk(req, res) {

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  res.json({
    message: "Chunk Uploaded",
  });
};








export async function createFolder(req, res) {

  const { title } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Album.create({
    title,
    description,
    thumbnail: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
  });

  res.json({
    message: "Folder Added",
  });
};




export async function getAllFolders (req, res) {
  const albums = await Folder.find();

  res.json(albums);
};




export async function addSong (req, res) {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, singer, album } = req.body;

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
    resource_type: "video",
  });

  await Song.create({
    title,
    description,
    singer,
    audio: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    album,
  });

  res.json({
    message: "Song Added",
  });
};




export async function addThumbnail (req, res) {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const file = req.file;

  const fileUrl = getDataurl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Song.findByIdAndUpdate(
    req.params.id,
    {
      thumbnail: {
        id: cloud.public_id,
        url: cloud.secure_url,
      },
    },
    { new: true }
  );

  res.json({
    message: "thumbnail Added",
  });
};




export async function getAllSongs  (req, res) => {
  const songs = await Song.find();

  res.json(songs);
};




export async function getAllSongsByAlbum (req, res) => {
  const album = await Album.findById(req.params.id);
  const songs = await Song.find({ album: req.params.id });

  res.json({ album, songs });
};




export async function deleteSong (req, res) {
  const song = await Song.findById(req.params.id);

  await song.deleteOne();

  res.json({ message: "Song Deleted" });
};




export async function getSingleSong (req, res) {
  const song = await Song.findById(req.params.id);

  res.json(song);
};
