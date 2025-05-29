import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DerivedPublicKey } from "@dfinity/vetkeys";

interface RootKeyState {
  rootPublicKey?: number[];
  getRootPublicKey: () => DerivedPublicKey | undefined;
  setRootPublicKey: (key: DerivedPublicKey) => void;
}

export const useRootKeyStore = create<RootKeyState>()(
  persist(
    (set, get) => ({
      getRootPublicKey: () => {
        const rootPublicKey = get().rootPublicKey;
        if (!rootPublicKey) return undefined;
        const publicKeyBytes = new Uint8Array(rootPublicKey);
        return DerivedPublicKey.deserialize(publicKeyBytes);
      },
      setRootPublicKey: (key) => {
        set({
          rootPublicKey: Array.from(key.publicKeyBytes()),
        });
      },
    }),
    {
      name: "root-key-store",
      version: 1,
    },
  ),
);
