import { useBackendActor } from "@/backend-actor";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { IbeCiphertext, IbeIdentity, IbeSeed } from "@dfinity/vetkeys";
import { useGetRootPublicKey } from "@/hooks/use-get-root-public-key";
import { useGetUserKey } from "@/hooks/use-get-user-key";
import { useIdentityStore } from "@/state/identity";

type SendMessageArgs = {
  message: string;
  recipient: string;
};

export function useMessageSend() {
  const { actor: backend } = useBackendActor();
  const { data: rootPublicKey } = useGetRootPublicKey();
  const { data: userKey } = useGetUserKey();
  const username = useIdentityStore((state) => state.username);

  return useMutation({
    mutationFn: async ({ message, recipient }: SendMessageArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!rootPublicKey) {
        throw new Error("Root public key not available");
      }
      if (!userKey) {
        throw new Error("User key not available");
      }
      if (!username) {
        throw new Error("Username not available");
      }

      const messageBytes = new TextEncoder().encode(message);

      // Encrypt message for recipient using IBE
      const ibeEncryptedMessage = IbeCiphertext.encrypt(
        rootPublicKey,
        IbeIdentity.fromString(recipient),
        messageBytes,
        IbeSeed.random(),
      );

      // Encrypt message for sender using VetKey (for sent folder)
      const dkm = await userKey.asDerivedKeyMaterial();
      const senderEncryptedMessage = await dkm.encryptMessage(message, "");

      const result = await backend.message_send(
        username,
        recipient,
        Array.from(ibeEncryptedMessage.serialize()),
        senderEncryptedMessage,
      );

      if ("Err" in result) {
        throw new Error(`Error sending message: ${result.Err}`);
      }

      await queryClient.invalidateQueries({
        queryKey: ["message_list_received"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["message_list_sent"],
      });

      return result.Ok;
    },
  });
}
