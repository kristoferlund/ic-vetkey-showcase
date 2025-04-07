import { useBackendActor } from "@/backend-actor";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { actor: backend } = useBackendActor();

  console.log("Backend: ", backend);
  useEffect(() => {
    if (!backend) {
      console.log("Backend not ready");
      return;
    }

    const locks = backend.timelock_list();
    locks.then((locks) => {
      console.log("Locks: ", locks);
    });
  }, [backend]);
  return null;
}
