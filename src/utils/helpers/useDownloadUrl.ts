import { useQuery } from "@tanstack/react-query";
import { getDownloadUrlAPI } from "@/components/https/services/fileupload";

interface DownloadUrlResponse {
  target_url?: string;
}

export const useDownloadUrl = (fileKey: string | null | undefined) => {
  return useQuery<DownloadUrlResponse | undefined>({
    queryKey: ["download_url", fileKey],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!fileKey) {
        return undefined;
      }
      const response = await getDownloadUrlAPI({ file_key: fileKey });

      return response?.data?.data;
    },
    enabled: !!fileKey,
  });
};
