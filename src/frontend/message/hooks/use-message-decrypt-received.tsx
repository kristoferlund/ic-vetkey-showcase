import { useBackendActor } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { IbeCiphertext } from "@dfinity/vetkeys";
import { useGetUserKey } from "@/hooks/use-get-user-key";
import { useGetRootPublicKey } from "@/hooks/use-get-root-public-key";
import { useIdentityStore } from "@/state/identity";

type DecryptReceivedMessageArgs = {
  messageId: number;
  encryptedData: number[];
};

export function useMessageDecryptReceived() {
  const { actor: backend } = useBackendActor();
  const { data: userKey } = useGetUserKey();
  const { data: rootPublicKey } = useGetRootPublicKey();
  const identity = useIdentityStore((state) => state.identity);

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/require-await
    mutationFn: async ({
      messageId,
      encryptedData,
    }: DecryptReceivedMessageArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!userKey) {
        throw new Error("User key not available");
      }
      if (!rootPublicKey) {
        throw new Error("Root public key not available");
      }
      if (!identity) {
        throw new Error("Identity not available");
      }

      // Decrypt the IBE-encrypted message
      const encryptedBytes = new Uint8Array(encryptedData);
      const ibeCiphertext = IbeCiphertext.deserialize(encryptedBytes);
      const decryptedBytes = ibeCiphertext.decrypt(userKey);

      // Convert back to string
      const decryptedMessage = new TextDecoder().decode(decryptedBytes);

      return {
        messageId,
        message: decryptedMessage,
      };
    },
  });
}
