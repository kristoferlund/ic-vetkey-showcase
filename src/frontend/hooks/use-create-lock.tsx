import { useBackendActor } from "@/backend-actor";
import { bigintToLEUint8Array } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import * as vetkd from "ic-vetkd-utils";
import { queryClient } from "@/main";
// export default function useGreet(onSuccess: (data: string) => void) {
//   return useMutation({
//     mutationFn: (name: string) => {
//       return backend.timelock_list();
//     },
//     onSuccess,
//   });
// }
//

export default function useCreateLock() {
  const { actor: backend } = useBackendActor();

  return useMutation({
    mutationFn: async ({
      message,
      releaseTimeSeconds,
    }: {
      /// The message to be encrypted
      message: string;
      /// Number of seconds until the lock is released
      releaseTimeSeconds: number;
    }) => {
      if (!backend) {
        console.error("Backend actor not available");
        return;
      }

      console.log(Date.now());

      const releaseTimeNanos = BigInt(releaseTimeSeconds) * 1_000_000_000n;
      const keyResult =
        await backend.timelock_get_encryption_key(releaseTimeNanos);

      if ("Err" in keyResult) {
        console.error("Error getting encryption key", keyResult.Err);
        return;
      }

      const { lock_key_id: lockKeyId, lock_public_key: lockPublicKey } =
        keyResult.Ok;

      console.log("Canister public key", lockPublicKey);

      const seed = window.crypto.getRandomValues(new Uint8Array(32));
      const messageBytes = new TextEncoder().encode(message);
      const lockKeyIdBytes = bigintToLEUint8Array(lockKeyId, 8);

      console.log("lockKeyId", lockKeyIdBytes);
      const encryptedMessage = vetkd.IBECiphertext.encrypt(
        lockPublicKey as Uint8Array,
        messageBytes,
        lockKeyIdBytes,
        seed,
      );

      const lockResult = await backend.timelock_create(
        lockKeyId,
        encryptedMessage.serialize(),
      );

      if ("Err" in lockResult) {
        console.error("Error creating lock", lockResult.Err);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["timelock_list"],
      });

      return keyResult.Ok;
    },
  });
}
