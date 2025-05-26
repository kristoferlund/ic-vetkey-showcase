import { useBackendActor } from "@/backend-actor";
import { useQuery } from "@tanstack/react-query";

export function useNotesHas() {
  const { actor: backend } = useBackendActor();

  return useQuery({
    queryKey: ["notes_has"],
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
