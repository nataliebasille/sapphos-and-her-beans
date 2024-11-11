import {
  type AppRouterPageRoute,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { Sidebar } from "./_components/sidebar/sidebar";
import { Header } from "./_components/header";
import { SidebarToggle } from "./_components/sidebar/sidebar-toggle";
import { SidebarProvider } from "./_components/sidebar/sidebar-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { appFileRouter } from "~/server/uploader/appFileUploader";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(appFileRouter)}
      />
      <div className="layer md:layer-fixed">
        <SidebarToggle />
        <Sidebar className="layer-drawer" />
        <div className="layer-content">
          <Header />

          <main className="mx-auto w-full p-8 lg:w-11/12 xl:w-5/6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default withPageAuthRequired(
  // Cast is needed, because the type of withPageAuthRequired doesn't
  // allow for children
  ProtectedLayout as unknown as AppRouterPageRoute,
  {
    returnTo: "/",
  },
) as React.FC;
