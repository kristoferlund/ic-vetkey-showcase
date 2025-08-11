import { useBackendActor } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { useIdentityStore } from "@/state/identity";

export function useMessageListSent() {
  const { actor: backend } = useBackendActor();
  const identity = useIdentityStore((state) => state.identity);
  const username = useIdentityStore((state) => state.username);

  return useQuery({
    queryKey: ["message_list_sent", username],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!identity || !username) {
        throw new Error("Identity or username not available");
      }

      const result = await backend.message_list_sent(username);

      if ("Err" in result) {
        throw new Error(`Error listing sent messages: ${result.Err}`);
      }

      return result.Ok;
    },
    enabled: !!backend && !!identity && !!username,
  });
}