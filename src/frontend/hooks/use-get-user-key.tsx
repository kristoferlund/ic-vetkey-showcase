import { useBackendActor } from "@/backend-actor";
import { useQuery } from "@tanstack/react-query";
import { EncryptedVetKey, TransportSecretKey } from "@dfinity/vetkeys";
import { useIdentityStore } from "@/state/identity";
import { useUserKeyStore } from "@/state/user-key";
import { useGetRootPublicKey } from "./use-get-root-public-key";

export function useGetUserKey() {
  const { actor: backend } = useBackendActor();
  const { data: rootPublicKey } = useGetRootPublicKey();
  const identity = useIdentityStore((state) => state.identity);
  const username = useIdentityStore((state) => state.username);
  const setUserKey = useUserKeyStore((state) => state.setUserKey);
  const getUserKey = useUserKeyStore((state) => state.getUserKey);

  return useQuery({
    enabled: !!backend && !!identity,
    queryKey: ["get_user_key", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }
      if (!identity || !username) {
        throw new Error("Identity not available");
      }
      if (!rootPublicKey) {
        throw new Error("Root public key not available");
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
        username,
      );
      if ("Err" in userKeyResult) {
        throw new Error(`Error getting user key: ${userKeyResult.Err}`);
      }

      // Create a new EncryptedVetKey instance from the user key bytes
      const encryptedVetKey = new EncryptedVetKey(
        Uint8Array.from(userKeyResult.Ok),
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
