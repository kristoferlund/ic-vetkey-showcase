import { useBackendActor } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { useGetUserKey } from "@/hooks/use-get-user-key";

type DecryptSentMessageArgs = {
  messageId: number;
  encryptedData: number[];
};

export function useMessageDecryptSent() {
  const { actor: backend, isAuthenticated } = useBackendActor();
  const { data: userKey } = useGetUserKey();

  return useMutation({
    mutationFn: async ({
      messageId,
      encryptedData,
    }: DecryptSentMessageArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!userKey) {
        throw new Error("User key not available");
      }
      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      // Decrypt the VetKey-encrypted message (similar to encrypted notes)
      const dkm = await userKey.asDerivedKeyMaterial();
      const decryptedMessage = await dkm.decryptMessage(
        new Uint8Array(encryptedData),
        "",
      );

      return {
        messageId,
        message: new TextDecoder().decode(decryptedMessage),
      };
    },
  });
}
