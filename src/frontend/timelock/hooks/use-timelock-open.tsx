import { useBackendActor } from "@/backend-actor";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

export default function useTimeLockOpen() {
  const { actor: backend } = useBackendActor();

  return useMutation({
    mutationFn: async ({ lock_id }: { lock_id: bigint }) => {
      if (!backend) {
        console.error("Backend actor not available");
        return;
      }

      const result = await backend.timelock_open(lock_id);

      if ("Err" in result) {
        console.error("Error unlocking lock:", result.Err);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["timelock_list"],
      });
    },
  });
}
