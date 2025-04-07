import CallToLogin from "@/components/call-to-login";
import TimeLockCreateCard from "@/timelock/components/timelock-create-card";
import TimeLockListCard from "@/timelock/components/timelock-list-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timelock")({
  component: About,
});

function About() {
  return (
    <div className="flex flex-col items-center text-xl text-white gap-5">
      <CallToLogin />
      <h2>Timelock</h2>
      <div className="text-center">
        Encrypt a message and set a release time. After the release time, anyone
        can decrypt the message.
      </div>
      <TimeLockCreateCard />
      <TimeLockListCard />
    </div>
  );
}
