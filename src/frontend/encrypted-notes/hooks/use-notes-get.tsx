import { useBackendActor } from "@/backend-actor";
import { useIdentityStore } from "@/state/identity";
import { useQuery } from "@tanstack/react-query";

export function useNotesGet() {
  const { actor: backend } = useBackendActor();
  const identity = useIdentityStore((state) => state.identity);

  return useQuery({
    queryKey: ["notes_get", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }

      const result = await backend.notes_get();

      if ("Err" in result) {
        throw new Error(`Error getting note: ${result.Err}`);
      }

      return result.Ok;
    },
    enabled: !!backend,
  });
}
