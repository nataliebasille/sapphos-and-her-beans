"use client";

import { generateReactHelpers, useDropzone } from "@uploadthing/react";
import { memo, useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { type AppFileRouter } from "~/server/uploader/appFileUploader";
import { ProgressBar } from "../ui/progress-bar";
import { useSubmitToggle } from "./form-provider";

const { useUploadThing: useUploader } = generateReactHelpers<AppFileRouter>();
type ImageInputProps = {
  uploader: Parameters<typeof useUploader>[0];
  name?: string;
  className?: string;
};

export const FileInput = memo(
  ({ className, name, uploader }: ImageInputProps) => {
    const { enableSubmit, disableSubmit } = useSubmitToggle();
    const [fileData, setFileData] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const hasFile = fileData !== null;
    const [image, setImage] = useState<string | null>(null);
    const setImagePreview = useCallback((file: File) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        setFileData(fileReader.result as string);
      };
    }, []);
    const { startUpload, routeConfig } = useUploader(uploader, {
      onBeforeUploadBegin(files) {
        if (files[0]) setImagePreview(files[0]);

        setUploading(true);
        setProgress(0);
        disableSubmit();
        return files;
      },
      onUploadProgress(p) {
        setProgress(p);
      },
      onUploadError() {
        setUploading(false);
        enableSubmit();
      },
      onClientUploadComplete(res) {
        setImage(res[0]?.url ?? null);
        setUploading(false);
        enableSubmit();
      },
    });
    const { getRootProps, getInputProps } = useDropzone({
      onDrop: (files) => {
        void startUpload(files);
      },
      multiple: false,
      accept: useMemo(
        () =>
          generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes,
          ),
        [routeConfig],
      ),
    });

    const rootProps = getRootProps();
    return (
      <div
        {...rootProps}
        className={twMerge(
          "relative col-span-full row-span-full grid h-full w-full cursor-pointer grid-cols-1 grid-rows-1 items-center justify-center overflow-hidden rounded !border-2 !border-dashed !border-secondary-border bg-secondary-base/5 transition-all duration-300",
          className,
        )}
      >
        <input type="hidden" name={name} value={image ?? ""} />
        <div
          style={fileData ? { backgroundImage: `url(${fileData})` } : undefined}
          className="pointer-events-none col-start-1 col-end-1 row-start-1 row-end-1 h-full w-full bg-cover bg-center bg-no-repeat"
        />

        <div className="col-start-1 col-end-1 row-start-1 row-end-1 flex flex-col gap-4 justify-self-center">
          {!hasFile && (
            <>
              <span className="text-lg uppercase tracking-widest">
                Drag and drop a file
              </span>
              <div className="divider divider-primary my-0">OR</div>
              <button type="button" className={twMerge("btn text-nowrap")}>
                Choose file
              </button>
            </>
          )}
        </div>

        <div
          className={twMerge(
            "pointer-events-none col-start-1 col-end-1 row-start-1 row-end-1 h-full w-full opacity-0 transition-all duration-300",
            // isHovering && `bg-secondary-base/20 opacity-100`,
          )}
        />
        <input {...getInputProps()} />

        {/** Uploading mask */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50 px-5">
            <ProgressBar value={progress} className="text-center">
              Uploading ...
            </ProgressBar>
          </div>
        )}
      </div>
    );
  },
);

FileInput.displayName = "FileInput";
