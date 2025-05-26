import { useBackendActor } from "@/backend-actor";
import { useQuery } from "@tanstack/react-query";

export default function useNotesGet() {
  const { actor: backend } = useBackendActor();

  return useQuery({
    queryKey: ["notes_get"],
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