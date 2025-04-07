/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from "react";
import {
  ActorProvider,
  createActorContext,
  createUseActorHook,
} from "ic-use-actor";
import { _SERVICE } from "../backend/declarations/backend.did";
import { canisterId, idlFactory } from "../backend/declarations/index";
import { useIdentityStore } from "./state/identity";

const actorContext = createActorContext<_SERVICE>();
export const useBackendActor = createUseActorHook<_SERVICE>(actorContext);

export default function BackendActorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const identity = useIdentityStore((state) => state.identity);

  return (
    <ActorProvider<_SERVICE>
      canisterId={canisterId}
      context={actorContext}
      identity={identity}
      idlFactory={idlFactory}
    >
      {children}
    </ActorProvider>
  );
}
