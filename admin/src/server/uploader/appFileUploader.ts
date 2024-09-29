import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { protectedRpcClient } from "../client/rpc-client";
const f = createUploadthing();

type FileRouterInputConfig = Parameters<typeof f>[0];

export const appFileRouter = {
  imageUploader: createUploader({ image: { maxFileSize: "2MB" } }),
} satisfies FileRouter;

function createUploader(input: FileRouterInputConfig) {
  const uploader = f(input);
  const uploadMiddleware = protectedRpcClient.action(async function (
    _,
    { context: { session } },
  ) {
    return session;
  });

  return uploader
    .middleware(async () => {
      const result = await uploadMiddleware();
      if (result.type === "error" || !result.value) {
        throw new UploadThingError("Unauthorized");
      }

      return result.value;
    })
    .onUploadComplete(async function ({ file }) {
      return { url: file.url };
    });
}

export type AppFileRouter = typeof appFileRouter;
