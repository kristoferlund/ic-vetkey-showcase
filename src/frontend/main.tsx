import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Create a new Tanstack Query client instance
export const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import BackendActorProvider from "./backend-actor";

// Create a new Tanstack Router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BackendActorProvider>
        <RouterProvider router={router} />
      </BackendActorProvider>
    </QueryClientProvider>
  </StrictMode>,
);
