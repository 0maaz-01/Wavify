import { useMutation } from "@tanstack/react-query";
import { getChunks } from "../lib/videos";


const useGetChunks = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: getChunks,
  });

  return { error, isPending, getChunksMutation : mutate };
};

export default useGetChunks;