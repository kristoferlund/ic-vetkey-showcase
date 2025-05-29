import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VetKey } from "@dfinity/vetkeys";

interface UserKeysState {
  userKeys: Record<string, number[] | undefined>;
  getUserKey: (key: string) => VetKey | undefined;
  setUserKey: (key: string, value: VetKey) => void;
}

export const useUserKeysStore = create<UserKeysState>()(
  persist(
    (set, get) => ({
      userKeys: {},
      getUserKey: (key) => {
        const arr = get().userKeys[key];
        if (!arr) {
          return undefined;
        }
        const bytes = new Uint8Array(arr);
        return VetKey.deserialize(bytes);
      },
      setUserKey: (key, vetKey) => {
        const bytes = vetKey.signatureBytes();
        set({
          userKeys: {
            ...get().userKeys,
            [key]: Array.from(bytes),
          },
        });
      },
    }),
    {
      name: "user-keys-store",
      version: 1,
    },
  ),
);
