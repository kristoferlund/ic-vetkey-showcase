import { useBackendActor } from "@/backend-actor";
import { bigintToLEUint8Array } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import * as vetkd from "ic-vetkd-utils";
import { queryClient } from "@/main";

type CreateLockArgs = {
  // The message to be encrypted
  message: string;
  // Number of seconds until the lock is released
  releaseTimeSeconds: number;
};

export default function useTimeLockCreate() {
  const { actor: backend } = useBackendActor();

  return useMutation({
    mutationFn: async ({ message, releaseTimeSeconds }: CreateLockArgs) => {
      if (!backend) {
        console.error("Backend actor not available");
        return;
      }

      const rootPublicKeyResult = await backend.get_root_public_key();
      if ("Err" in rootPublicKeyResult) {
        console.error(
          "Error getting root vetket public key",
          rootPublicKeyResult.Err,
        );
        return;
      }
      const rootPublicKey = rootPublicKeyResult.Ok as Uint8Array;

      const messageBytes = new TextEncoder().encode(message);

      const releaseTimeNanos = BigInt(releaseTimeSeconds) * 1_000_000_000n;
      const timeLockId = BigInt(Date.now()) * 1_000_000n + releaseTimeNanos;
      const timeLockIdBytes = bigintToLEUint8Array(timeLockId, 8);

      const seed = window.crypto.getRandomValues(new Uint8Array(32));

      const encryptedMessage = vetkd.IBECiphertext.encrypt(
        rootPublicKey,
        timeLockIdBytes,
        messageBytes,
        seed,
      );

      const lockResult = await backend.timelock_create(
        timeLockId,
        encryptedMessage.serialize(),
      );

      if ("Err" in lockResult) {
        console.error("Error creating lock", lockResult.Err);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["timelock_list"],
      });

      return lockResult.Ok;
    },
  });
}
