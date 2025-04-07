import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ed25519KeyIdentity } from "@dfinity/identity";

async function createIdentity(username: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(username);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hash = new Uint8Array(hashBuffer);
  return Ed25519KeyIdentity.generate(hash);
}

interface IdentityState {
  identity: Ed25519KeyIdentity | undefined;
  username: string | undefined;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      identity: undefined,
      username: undefined,
      login: async (username: string) => {
        const identity = await createIdentity(username);
        set({ identity, username });
      },
      logout: () => {
        set({ identity: undefined, username: undefined });
      },
    }),
    {
      name: "identity-storage",
      partialize: (state) => ({
        username: state.username,
      }),
      onRehydrateStorage: () => async (state) => {
        const username = state?.username;
        if (username) {
          const identity = await createIdentity(username);
          state.identity = identity;
        }
      },
    },
  ),
);
