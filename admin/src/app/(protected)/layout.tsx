import {
  type AppRouterPageRoute,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { Sidebar } from "./_components/sidebar";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layer layer-fixed">
      <aside className="layer-drawer flex w-72 flex-col bg-primary-base">
        <Sidebar />
      </aside>
      <main className="layer-content mx-auto w-full p-8 lg:w-5/6 xl:w-4/6">
        {children}
      </main>
    </div>
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
