import { useBackendActor } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { useGetUserKey } from "@/hooks/use-get-user-key";
import { queryClient } from "@/main";

type SaveNoteArgs = {
  message: string;
};

export function useNotesSave() {
  const { actor: backend } = useBackendActor();
  const { data: userKey } = useGetUserKey();

  return useMutation({
    mutationFn: async ({ message }: SaveNoteArgs) => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!userKey) {
        throw new Error("User key not available");
      }

      if (message.length > 512) {
        throw new Error("Note cannot exceed 512 characters");
      }

      // Encrypt the message using the user's derived key material
      const dkm = await userKey.asDerivedKeyMaterial();
      const encryptedMessage = await dkm.encryptMessage(message, "");

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
