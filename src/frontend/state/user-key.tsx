import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VetKey } from "@dfinity/vetkeys";

type SerializableVetKey = string;

interface UserKeyState {
  userKeys: Record<string, SerializableVetKey>;
  getUserKey: (key: string) => VetKey | undefined;
  setUserKey: (key: string, value: VetKey) => void;
}

export const useUserKeyStore = create<UserKeyState>()(
  persist(
    (set, get) => ({
      userKeys: {},
      getUserKey: (key) => {
        const hex = get().userKeys[key];
        if (!hex) return undefined;
        const matches = hex.match(/.{1,2}/g);
        if (!matches) return undefined;
        const bytes = new Uint8Array(matches.map((b) => parseInt(b, 16)));
        return VetKey.deserialize(bytes);
      },
      setUserKey: (key, vetKey) => {
        const bytes = vetKey.signatureBytes();
        const hex = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        set({
          userKeys: {
            ...get().userKeys,
            [key]: hex,
          },
        });
      },
    }),
    {
      name: "user-key-store",
    },
  ),
);
