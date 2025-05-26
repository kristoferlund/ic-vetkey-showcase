import { useBackendActor } from "@/backend-actor";
import { useQuery } from "@tanstack/react-query";
import {
  DerivedPublicKey,
  EncryptedVetKey,
  TransportSecretKey,
} from "@dfinity/vetkeys";
import { useIdentityStore } from "@/state/identity";
import { useUserKeyStore } from "@/state/user-key";

export function useGetUserKey() {
  const { actor: backend } = useBackendActor();
  const identity = useIdentityStore((state) => state.identity);
  const setUserKey = useUserKeyStore((state) => state.setUserKey);
  const getUserKey = useUserKeyStore((state) => state.getUserKey);

  return useQuery({
    enabled: !!backend && !!identity,
    queryKey: ["getUserKey", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!identity) {
        throw new Error("Identity not available");
      }

      let userKey = getUserKey(identity.getPrincipal().toText());
      if (userKey) {
        return userKey;
      }

      // The transport key is used to encrypt the user key at time of creation
      // so that it can be securely transported to the frontend
      const transportSecretKey = TransportSecretKey.random();
      const userKeyResult = await backend.get_user_key(
        transportSecretKey.publicKeyBytes(),
      );
      if ("Err" in userKeyResult) {
        throw new Error(`Error getting user key: ${userKeyResult.Err}`);
      }

      // Create a new EncryptedVetKey instance from the user key bytes
      const encryptedVetKey = new EncryptedVetKey(
        Uint8Array.from(userKeyResult.Ok),
      );

      // The root vetkey public key for the backend canister is needed when decrypting
      // the user key
      const rootPublicKeyResult = await backend.get_root_public_key();
      if ("Err" in rootPublicKeyResult) {
        throw new Error(
          `Error getting root vetkey public key: ${rootPublicKeyResult.Err}`,
        );
      }
      const rootPublicKey = DerivedPublicKey.deserialize(
        rootPublicKeyResult.Ok as Uint8Array,
      );

      userKey = encryptedVetKey.decryptAndVerify(
        transportSecretKey,
        rootPublicKey,
        identity.getPrincipal().toUint8Array(),
      );

      setUserKey(identity.getPrincipal().toString(), userKey);

      return userKey;
    },
  });
}
