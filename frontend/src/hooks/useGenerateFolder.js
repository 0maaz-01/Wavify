import { useMutation } from "@tanstack/react-query";
import { generateFolder } from "../lib/videos";


const useGenerateFolder = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: generateFolder,
  });

  return { error, isPending, generateFolderMutation: mutateAsync };
};


export default useGenerateFolder;