import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ErrorComponent } from "@tanstack/react-router";
import { queryClient } from "./utils/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUser } from "./features/auth/hooks/useUser";

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <h3>Loadings...</h3>
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: {
    queryClient,
    isAuthenticated: false,
    user: null,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  const { data } = useUser();

  return (
    <>
      <RouterProvider
        router={router}
        context={{
          queryClient,
          user: data,
          isAuthenticated: !!data,
        }}
      />
      <TanStackRouterDevtools router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
