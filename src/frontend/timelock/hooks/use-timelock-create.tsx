import { useBackendActor } from "@/main";
import { bigintToLEUint8Array } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { IbeCiphertext, IbeIdentity, IbeSeed } from "@dfinity/vetkeys";
import { useGetRootPublicKey } from "@/hooks/use-get-root-public-key";

type CreateLockArgs = {
  // The message to be encrypted
  message: string;
  // Number of seconds until the lock is released
  releaseTimeSeconds: number;
};

export function useTimeLockCreate() {
  const { actor: backend } = useBackendActor();
  const { data: rootPublicKey } = useGetRootPublicKey();

  return useMutation({
    mutationFn: async ({ message, releaseTimeSeconds }: CreateLockArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!rootPublicKey) {
        throw new Error("Root public key not available");
      }

      const messageBytes = new TextEncoder().encode(message);

      const releaseTimeNanos = BigInt(releaseTimeSeconds) * 1_000_000_000n;
      const timeLockId = BigInt(Date.now()) * 1_000_000n + releaseTimeNanos;
      const timeLockIdBytes = bigintToLEUint8Array(timeLockId, 8);

      const encryptedMessage = IbeCiphertext.encrypt(
        rootPublicKey,
        IbeIdentity.fromBytes(timeLockIdBytes),
        messageBytes,
        IbeSeed.random(),
      );

      const lockResult = await backend.timelock_create(
        timeLockId,
        encryptedMessage.serialize(),
      );

      if ("Err" in lockResult) {
        throw new Error(`Error creating lock: ${lockResult.Err}`);
      }

      await queryClient.invalidateQueries({
        queryKey: ["timelock_list"],
      });

      return lockResult.Ok;
    },
  });
}
