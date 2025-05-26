import EncryptedNotesCard from "@/encrypted-notes/components/encrypted-notes-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/encrypted-notes")({
  component: EncryptedNotes,
});

function EncryptedNotes() {
  return (
    <div className="flex flex-col items-center text-xl text-white gap-5">
      <EncryptedNotesCard />
    </div>
  );
}