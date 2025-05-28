import { useBackendActor } from "@/backend-actor";
import { DerivedPublicKey } from "@dfinity/vetkeys";
import { useQuery } from "@tanstack/react-query";

export function useGetRootPublicKey() {
  const { actor: backend } = useBackendActor();

  return useQuery({
    queryKey: ["get_root_public_key"],
    enabled: !!backend,
    queryFn: async () => {
      if (!backend) {
        throw new Error("Backend actor not available");
      }

      const rootPublicKeyResult = await backend.get_root_public_key();

      if ("Err" in rootPublicKeyResult) {
        throw new Error(
          `Error getting root public key: ${rootPublicKeyResult.Err}`,
        );
      }

      return DerivedPublicKey.deserialize(rootPublicKeyResult.Ok as Uint8Array);
    },
  });
}
