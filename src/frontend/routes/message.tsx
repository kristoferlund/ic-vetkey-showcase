import MessageCard from "@/message/components/message-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/message")({
  component: Message,
});

function Message() {
  return (
    <div className="flex flex-col items-center text-xl text-white gap-5">
      <MessageCard />
    </div>
  );
}