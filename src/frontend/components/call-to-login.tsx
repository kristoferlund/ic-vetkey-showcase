import { useBackendActor } from "@/backend-actor";

export default function CallToLogin() {
  const { actor: backend } = useBackendActor();

  if (backend) {
    return null;
  }

  return (
    <div className="text-red-500/50">
      Login to access showcase functionality.
    </div>
  );
}
