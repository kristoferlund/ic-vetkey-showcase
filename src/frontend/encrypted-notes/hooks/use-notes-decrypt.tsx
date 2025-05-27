import { useBackendActor } from "@/backend-actor";
import { useMutation } from "@tanstack/react-query";
import { useGetUserKey } from "@/hooks/use-get-user-key";
import { DerivedKeyMaterial } from "@dfinity/vetkeys";

export function useNotesDecrypt() {
  const { actor: backend } = useBackendActor();
  const { data: userKey } = useGetUserKey();

  return useMutation({
    mutationFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!userKey) {
        throw new Error("Private key not available");
      }

      // Get the encrypted note
      const noteResult = await backend.notes_get();
      if ("Err" in noteResult) {
        throw new Error(`Error getting note: ${noteResult.Err}`);
      }
      const encryptedNote = noteResult.Ok;

      // Use the private key to decrypt the note
      const dkm = await DerivedKeyMaterial.setup(userKey.signatureBytes());
      const decryptedMessage = await dkm.decryptMessage(
        encryptedNote.data as Uint8Array,
        "",
      );

      return {
        message: new TextDecoder().decode(decryptedMessage),
        metadata: {
          createdAt: encryptedNote.created_at,
          updatedAt: encryptedNote.updated_at,
          owner: encryptedNote.owner.toText(),
        },
      };
    },
  });
}
