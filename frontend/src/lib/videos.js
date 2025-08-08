import { axiosInstance } from "./axios";


export const uploadChunk = async ({chunks, count}) => {
    const formData = new FormData();
    // console.log(count)
    chunks.forEach((chunk, i) => {
        // const value = `${(count * 10) + i}.webm`
        formData.append("chunk", chunk, `${(count * 10) + (i + 1)}.webm`);
        // console.log(value)
    });
    const response = await axiosInstance.post("/video/upload-chunks", formData);
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