import { useBackendActor } from "@/backend-actor";
import { useIdentityStore } from "@/state/identity";
import { useQuery } from "@tanstack/react-query";

export function useNotesHas() {
  const { actor: backend } = useBackendActor();
  const identity = useIdentityStore((state) => state.identity);

  return useQuery({
    queryKey: ["notes_has", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }

      const result = await backend.notes_has();

      if ("Err" in result) {
        throw new Error(`Error checking if note exists: ${result.Err}`);
      }

      return result.Ok;
    },
    enabled: !!backend,
  });
}
