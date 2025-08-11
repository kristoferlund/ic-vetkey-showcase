import { useBackendActor } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { useIdentityStore } from "@/state/identity";

export function useMessageListReceived() {
  const { actor: backend, isAuthenticated } = useBackendActor();
  const username = useIdentityStore((state) => state.username);

  return useQuery({
    queryKey: ["message_list_received", username],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!username) {
        throw new Error("Username not available");
      }

      const result = await backend.message_list_received(username);

      if ("Err" in result) {
        throw new Error(`Error listing received messages: ${result.Err}`);
      }

      return result.Ok;
    },
    enabled: !!backend && isAuthenticated && !!username,
  });
}
