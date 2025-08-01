import { useMutation } from "@tanstack/react-query";
import { getAllFolders } from "../lib/videos";


const useGetAllFolders = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: getAllFolders,
  });

  return { error, isPending, getAllFoldersMutation : mutate };
};

export default useGetAllFolders;