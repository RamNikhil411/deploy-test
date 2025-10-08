import { toast } from "sonner";

export const downloadFileFromS3 = async (url: string, fileName: string) => {
  try {
    fetch(url, {
      cache: "no-store",
    })
      .then((response) => {
        const contentDisposition = response.headers.get("content-disposition");
        let filename = fileName;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }
        return response.blob().then((blob) => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        window.URL.revokeObjectURL(blobUrl);
        toast.success("File downloaded Successful!");
      })
      .catch((error) => {
        toast.error("File download failed!");
      });
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
  }
};
