import { useBackendActor } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

export function useTimeLockOpen() {
  const { actor: backend } = useBackendActor();

  return useMutation({
    mutationFn: async ({ lock_id }: { lock_id: bigint }) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }

      const result = await backend.timelock_open(lock_id);

      if ("Err" in result) {
        throw new Error(`Error unlocking lock: ${result.Err}`);
      }

      await queryClient.invalidateQueries({
        queryKey: ["timelock_list"],
      });
    },
  });
}
