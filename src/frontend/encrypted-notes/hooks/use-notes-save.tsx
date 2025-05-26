import { useBackendActor } from "@/backend-actor";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import useGetUserKey from "./use-get-user-key";
import { DerivedKeyMaterial } from "@dfinity/vetkeys";

type SaveNoteArgs = {
  message: string;
};

export default function useNotesSave() {
  const { actor: backend } = useBackendActor();
  const { data: vetkeyPrivateKey } = useGetUserKey();

  return useMutation({
    mutationFn: async ({ message }: SaveNoteArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!vetkeyPrivateKey) {
        throw new Error("Private key not available");
      }

      if (message.length > 512) {
        throw new Error("Note cannot exceed 512 characters");
      }

      const dmk = await DerivedKeyMaterial.setup(
        vetkeyPrivateKey.signatureBytes(),
      );

      const encryptedMessage = await dmk.encryptMessage(message, "");

      // Save the encrypted note
      const result = await backend.notes_save(encryptedMessage);

      if ("Err" in result) {
        throw new Error(`Error saving note: ${result.Err}`);
      }

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["notes_get"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["notes_has"],
      });

      return result.Ok;
    },
  });
}
