import { create } from "zustand";
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

export const useIdentityStore = create<IdentityState>((set) => ({
  identity: undefined,
  username: undefined,
  login: async (username: string) => {
    set({
      identity: await createIdentity(username),
      username,
    });
  },
  logout: () => {
    set({
      identity: undefined,
      username: undefined,
    });
  },
}));
