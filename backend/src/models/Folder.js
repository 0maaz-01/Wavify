import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    audio: {
      type: String,
      required: true,
    },

    chunks: {
      type: String,
      required: true,
    },

    recording: {
      type: String,
      required: true,
    },
    
    video: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

export const Folder = mongoose.model("Folder", schema);