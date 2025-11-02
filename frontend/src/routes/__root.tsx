import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();

const RootLayout = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
