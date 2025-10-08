import { $fetch } from "../fetch";
export const fileUploadAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/files/upload-url", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadDocumentAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/docs", payload);
    return response;
  } catch (error) {
    throw error;
  }
};
export const uploadToS3API = async (url: string, file: File) => {
  try {
    const options = {
      method: "PUT",
      body: file,
    };
    return await fetch(url, options);
  } catch (err) {
    throw err;
  }
};

export const getDownloadUrlAPI = async ({ file_key }: { file_key: string }) => {
  try {
    const response = await $fetch.post(`/files/download-url`, {
      file_key,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
