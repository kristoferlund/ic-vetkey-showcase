import { useBackendActor } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { EncryptedVetKey, TransportSecretKey } from "@dfinity/vetkeys";
import { useIdentityStore } from "@/state/identity";
import { useUserKeysStore } from "@/state/user-keys";
import { useGetRootPublicKey } from "./use-get-root-public-key";

export function useGetUserKey() {
  const { actor: backend } = useBackendActor();
  const { data: rootPublicKey } = useGetRootPublicKey();
  const identity = useIdentityStore((state) => state.identity);
  const username = useIdentityStore((state) => state.username);
  const setUserKey = useUserKeysStore((state) => state.setUserKey);
  const getUserKey = useUserKeysStore((state) => state.getUserKey);

  return useQuery({
    queryKey: ["get_user_key", username],
    enabled: !!backend && !!identity && !!username && !!rootPublicKey,
    queryFn: async () => {
      if (!backend || !identity || !username || !rootPublicKey) {
        return;
      }

      // First, check if we have a cached user key and return it if available
      // React Query caches queries but in this case we want to use a custom store
      // to minimize the number of times we fetch the user key
      const cachedUserKey = getUserKey(username);
      if (cachedUserKey) {
        return cachedUserKey;
      }

      // No cached user key, we need to fetch it from the backend
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

      // Decrypt and verify the user key using the transport secret key and canister
      // root public key
      const userKey = encryptedVetKey.decryptAndVerify(
        transportSecretKey,
        rootPublicKey,
        new TextEncoder().encode(username),
      );

      // Store the user key in the user key store for future use
      setUserKey(username, userKey);

      return userKey;
    },
  });
}
