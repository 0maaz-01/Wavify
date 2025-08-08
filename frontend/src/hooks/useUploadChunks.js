import { useMutation } from "@tanstack/react-query";
import { uploadChunk } from "../lib/videos";


const useUploadChunks = () => {
  return useMutation({
    mutationFn: uploadChunk,
  });
};

export default useUploadChunks;
