import {
  type AppRouterPageRoute,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { Sidebar } from "./_components/sidebar/sidebar";
import { Header } from "./_components/header";
import { SidebarToggle } from "./_components/sidebar/sidebar-toggle";
import { SidebarProvider } from "./_components/sidebar/sidebar-provider";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
