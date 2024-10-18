import { createRouteHandler } from "uploadthing/next";
import { appFileRouter } from "~/server/uploader/appFileUploader";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: appFileRouter,
});
