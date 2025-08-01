import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadChunk } from "../lib/videos";


const useUploadChunks = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: uploadChunk,
  });

  return { error, isPending, uploadChunksMutation: mutate };
};

export default useUploadChunks;