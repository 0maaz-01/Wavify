import { useMutation } from "@tanstack/react-query";
import { generateFolder } from "../lib/videos";


const useGenerateFolder = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: generateFolder,
  });

  return { error, isPending, generateFolderMutation : mutate };
};

export default useGenerateFolder;