import {
  type AppRouterPageRoute,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { Sidebar } from "./+sidebar";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layer layer-fixed">
      <aside className="layer-drawer flex min-w-72 flex-col bg-primary-base">
        <Sidebar />
      </aside>
      <main className="layer-content p-4">{children}</main>
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
);
