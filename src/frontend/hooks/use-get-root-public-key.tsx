import { useBackendActor } from "@/main";
import { useRootKeyStore } from "@/state/root-key";
import { DerivedPublicKey } from "@dfinity/vetkeys";
import { useQuery } from "@tanstack/react-query";

export function useGetRootPublicKey() {
  const { actor: backend } = useBackendActor();
  const getCachedRootKey = useRootKeyStore((state) => state.getRootPublicKey);
  const setRootPublicKey = useRootKeyStore((state) => state.setRootPublicKey);

  return useQuery({
    queryKey: ["get_root_public_key"],
    enabled: !!backend,
    queryFn: async () => {
      if (!backend) {
        return;
      }

      // First, check if we have a cached root public key and return it if available
      // React Query caches queries but in this case we want to use a custom store
      // to minimize the number of times we fetch the root public key
      const cachedRootKey = getCachedRootKey();
      if (cachedRootKey) {
        return cachedRootKey;
      }

      // No cached root public key, we need to fetch it from the backend
      const rootPublicKeyResult = await backend.get_root_public_key();
      if ("Err" in rootPublicKeyResult) {
        throw new Error(
          `Error getting root public key: ${rootPublicKeyResult.Err}`,
        );
      }

      // Create a new DerivedPublicKey instance from the public key bytes
      // returned by the backend
      const publicKeyBytes = rootPublicKeyResult.Ok as Uint8Array;
      const derivedPublicKey = DerivedPublicKey.deserialize(publicKeyBytes);

      // Store the derived public key in the user key store for future use
      setRootPublicKey(derivedPublicKey);

      return derivedPublicKey;
    },
  });
}
