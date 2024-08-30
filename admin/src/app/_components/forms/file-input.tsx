"use client";

import {
  type DragEventHandler,
  memo,
  type MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type ImageInputProps = {
  className?: string;
  name: string;
  accept?: string;
};

export const FileInput = memo(
  ({ className, name, accept }: ImageInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [fileData, setFileData] = useState<string | null>(null);
    const hasFile = fileData !== null;
    const setImagePreview = useCallback((file: File) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        setFileData(fileReader.result as string);
      };
    }, []);

    const handleFileChange = useCallback(
      (files: FileList) => {
        if (files.length === 1 && fileInputRef.current) {
          fileInputRef.current.files = files;
          const file = files[0]!;
          setImagePreview(file);
        }
      },
      [setImagePreview],
    );

    const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        e.preventDefault();
      },
      [],
    );
    const handleDragEnter: DragEventHandler<HTMLDivElement> =
      useCallback(() => {
        setIsHovering(true);
      }, []);

    const handleDragLeave: DragEventHandler<HTMLDivElement> =
      useCallback(() => {
        setIsHovering(false);
      }, []);

    const handleMouseLeave: MouseEventHandler<HTMLDivElement> =
      useCallback(() => {
        setIsHovering(false);
      }, []);

    const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        e.preventDefault();
        setIsHovering(false);
        const files = e.dataTransfer?.files;
        if (files) {
          handleFileChange(files);
        }
      },
      [handleFileChange],
    );

    const handleChooseFile = useCallback(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, []);

    const handleInputFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          handleFileChange(e.target.files);
        }
      },
      [handleFileChange],
    );

    return (
      <div
        className={twMerge(
          "col-span-full row-span-full grid h-full w-full cursor-pointer grid-cols-1 grid-rows-1 items-center justify-center overflow-hidden rounded !border-2 !border-dashed !border-secondary-border bg-secondary-base/5 transition-all duration-300",
          className,
        )}
        onClick={handleChooseFile}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseLeave={handleMouseLeave}
      >
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
            isHovering && `bg-secondary-base/20 opacity-100`,
          )}
        />
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          className="hidden"
          accept={accept}
          onChange={handleInputFileChange}
        />
      </div>
    );
  },
);

FileInput.displayName = "FileInput";
