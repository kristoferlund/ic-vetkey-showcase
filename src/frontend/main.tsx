import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { createActorHook } from "ic-use-actor";
import { _SERVICE } from "../backend/declarations/backend.did";
import { canisterId, idlFactory } from "../backend/declarations";

// Create a new Tanstack Query client instance. Query results are cached indefinitely.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});


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

// Create an actor hook we can use to communicate with the canister backend
export const useBackendActor = createActorHook<_SERVICE>({
  canisterId,
  idlFactory,
});

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
