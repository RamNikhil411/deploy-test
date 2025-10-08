import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
// import * as pdfjsLib from "pdfjs-dist";
import React, { useEffect, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  fileUploadAPI,
  uploadToS3API,
} from "@/components/https/services/fileupload";
import { Button } from "@/components/ui/button";
import ImagePreview from "./ImagePreview";
import { AppToast } from "./customToast";
import { uploadOrgDocsAPI } from "../https/services/organization";
import { Loader, Loader2 } from "lucide-react";
// import { sliceFilename } from "~/lib/helpers/sliceFilename";
// import { FileUploadProps } from "~/lib/interfaces/files";
// import { FileUploadDialog } from "./FileUploadDialog";

// Set PDF.js worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
  refetch?: () => void;
  documentId?: number;
  children?: React.ReactNode;
  filesDetails?: any;
  onFileSelect?: (file: File, fileUrl: string | null) => void;
  crop?: boolean;
  setImage?: React.Dispatch<React.SetStateAction<string | undefined>>;
  fileSize?: number;
  fileUpload?: boolean;
  fileTypes?: string[];
  uploadStatus?: (status: "start" | "loading" | "success" | "error") => void;
}
const FileUpload: React.FC<FileUploadProps> = ({
  refetch,
  documentId,
  children,
  onFileSelect,
  crop,
  setImage,
  fileSize = 25,
  fileUpload,
  fileTypes,
  uploadStatus,
}) => {
  const { form_id } = useParams({ strict: false });
  const params = useParams({ strict: false });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<null | string>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [fileForUpload, setFileForUpload] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const file = acceptedFiles[0];
    if (file?.size > fileSize * 1024 * 1024) {
      AppToast.error({ message: `File size must be less than ${fileSize}MB` });
      return;
    }
    if (fileRejections.length > 0) {
      //   toast.warning(`Unsupported file type is uploaded`, {
      //     action: {
      //       label: "✕",
      //       onClick: () => toast.dismiss(),
      //     },
      //   });
    }

    setRejectionMessage(null);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    if (acceptedFiles[0]?.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {};
      reader.readAsDataURL(file);
    } else {
      setPreviewThumbnail(url);
    }

    if (crop) {
      setSrc(url);
      setFileForUpload(file);
    } else {
      if (onFileSelect) {
        onFileSelect(file, url);
      }

      handleFileUpload(file, documentId);
    }
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const message = rejectedFiles
      .map(({ file, errors }: any) =>
        errors.map((error: any) => {
          if (error.code === "file-invalid-type") {
            return `File "${file.name}" has an unsupported type.`;
          }
          return `File "${file.name}" was rejected. Reason: ${error.message}`;
        })
      )
      .flat()
      .join(", ");
  };

  const accept = useMemo(() => {
    if (fileTypes && fileTypes.length > 0) {
      return fileTypes.reduce<Record<string, string[]>>((acc, ext) => {
        const normalized = ext.startsWith(".") ? ext : `.${ext}`;
        if (normalized === ".pdf") acc["application/pdf"] = [".pdf"];
        if (normalized === ".jpg" || normalized === ".jpeg")
          acc["image/jpeg"] = [".jpg", ".jpeg"];
        if (normalized === ".png") acc["image/png"] = [".png"];
        if (normalized === ".webp") acc["image/webp"] = [".webp"];
        return acc;
      }, {});
    }
    return {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    };
  }, [fileTypes]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    multiple: false,
    noClick: true,
  });

  const handleFileUpload = (file: File, documentId?: number) => {
    getPresignedUrls({ file, documentId });
  };

  const { mutate: getPresignedUrls, isPending: isUploading } = useMutation({
    mutationFn: async ({
      file,
      documentId,
    }: {
      file: File;
      documentId?: number;
    }) => {
      const fileType = file.name.split(".").pop();
      uploadStatus?.("loading");
      const { data } = await fileUploadAPI({
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
      });
      const { target_url, file_key } = data?.data;
      if (!target_url) {
        throw new Error("Presigned URL is missing");
      }

      await uploadTos3(target_url, file);

      return {
        case_id: form_id,
        documentId,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        key: file_key,
      };
    },
    onSuccess: async ({ file_name, file_type, file_size, key, documentId }) => {
      if (onFileSelect) {
        onFileSelect(key, key);
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (previewThumbnail) {
        URL.revokeObjectURL(previewThumbnail);
        setPreviewThumbnail(null);
      }
      let organizationId = params?.organisation_id;

      if (fileUpload) {
        uploadDocsMutation.mutate({
          name: file_name,
          file_type,
          file_size,
          file_path: key,
          organization_id: Number(organizationId),
        });
      }

      uploadStatus?.("success");
    },
    onError: (error: any) => {
      if (
        error.response?.status === 422 &&
        error.response?.data?.errData?.file_size
      ) {
        AppToast.error(error.response.data.errData.file_size[0]);
      } else {
        AppToast.error({ message: "Failed to upload " });
      }
      uploadStatus?.("error");
    },
  });

  useEffect(() => {
    if (fileForUpload && !src) {
      handleFileUpload(fileForUpload, documentId);
    }
  }, [fileForUpload]);

  const uploadTos3 = async (url: string, file: File): Promise<void> => {
    try {
      const response = await uploadToS3API(url, file);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to upload file to S3");
      }
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  };

  const uploadDocsMutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        const response = await uploadOrgDocsAPI(
          params?.organisation_id,
          payload
        );
        if (response.data?.status === 200 || response.data?.status === 201) {
          refetch?.();
          return response;
        } else {
          throw new Error("Failed to upload ");
        }
      } catch (error) {}
    },
    onSuccess: () => {
      refetch?.();
    },
  });

  return (
    <>
      <div id="upload-attachments" className="w-full">
        <div className="w-full py-0 flex justify-between items-center">
          <Button
            type="button"
            onClick={() => {
              open();
              uploadStatus?.("start");
            }}
            variant="default"
            size="default"
            className={`h-fit w-full px-0 [&_svg]:w-[unset] [&_svg]:h-[unset] py-0 text-sm bg-transparent rounded-none hover:bg-transparent shadow-none ${
              isUploading ? "pointer-events-none" : ""
            }`}
          >
            {isUploading && fileUpload ? (
              <div className="flex items-center gap-2 bg-transparent border p-2 rounded">
                <Loader className="h-5 w-5 animate-spin text-black " />
              </div>
            ) : (
              children
            )}
          </Button>
        </div>

        <div>
          <div {...getRootProps()} className="hidden">
            <input {...getInputProps()} />
          </div>

          {rejectionMessage && (
            <p className="text-red-600 mt-2">{rejectionMessage}</p>
          )}
        </div>
      </div>
      {crop && (
        <ImagePreview
          src={src}
          setSrc={setSrc}
          setFile={setFileForUpload}
          setPreviewSrc={
            setImage as React.Dispatch<React.SetStateAction<string | undefined>>
          }
        />
      )}
    </>
  );
};

export default FileUpload;
