import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "../components/sidebar";

const queryClient = new QueryClient();

const RootLayout = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <div className="h-screen bg-zinc-900">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={40}>
            <Sidebar />
          </Panel>
          <PanelResizeHandle className="w-px bg-zinc-700 transition-colors duration-150 hover:bg-zinc-600" />
          <Panel defaultSize={80} minSize={60} maxSize={85}>
            <Outlet />
          </Panel>
        </PanelGroup>
      </div>
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
