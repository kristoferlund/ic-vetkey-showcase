import HomeButtonCard from "../components/home-button-card";
import TimeLockCreateCard from "@/timelock/components/timelock-create-card";
import TimeLockListCard from "@/timelock/components/timelock-list-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timelock")({
  component: About,
});

function About() {
  return (
    <div className="flex flex-col items-center text-xl text-white gap-5">
      <HomeButtonCard />
      <TimeLockCreateCard />
      <TimeLockListCard />
    </div>
  );
}
