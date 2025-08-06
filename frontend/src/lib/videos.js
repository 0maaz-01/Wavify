import { axiosInstance } from "./axios";


export const uploadChunk = async (chunk) => {
    const formData = new FormData();
    formData.append("chunk", chunk);

    const response = await axiosInstance.post("/video/upload-chunks", chunk);
    return response.data;
}


export const generateFolder = async () => {
    const response = await axiosInstance.post("/video/generate-folder");
    return response.data;
}


export const getChunks = async () => {
    const response = await axiosInstance.get("/video/get-chunks")
    return response.data;
}


export const getAllFolders = async () => {
    const response = await axiosInstance.get("/video/get-all-folders");
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.folders;
}