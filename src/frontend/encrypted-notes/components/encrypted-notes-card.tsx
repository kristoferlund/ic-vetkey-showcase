import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  LoaderCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { useBackendActor } from "@/backend-actor";
import { useNotesHas } from "../hooks/use-notes-has";
import { useNotesSave } from "../hooks/use-notes-save";
import { useNotesDecrypt } from "../hooks/use-notes-decrypt";
import { useEffect, useState } from "react";
import { useIdentityStore } from "@/state/identity";

export default function EncryptedNotesCard() {
  const { actor: backend } = useBackendActor();
  const { data: hasNote, isLoading: hasNoteLoading } = useNotesHas();
  const { mutateAsync: saveNote, isPending: isSaving } = useNotesSave();
  const { mutateAsync: decryptNote, isPending: isDecrypting } =
    useNotesDecrypt();
  const identity = useIdentityStore((state) => state.identity);

  const [noteText, setNoteText] = useState("");
  const [decryptedNote, setDecryptedNote] = useState<string | null>(null);
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNoteText("");
    setDecryptedNote(null);
    setShowDecrypted(false);
    setError(null);
  }, [identity]);

  const handleSaveNote = async () => {
    try {
      setError(null);
      await saveNote({ message: noteText });
      setNoteText("");
      setDecryptedNote(null);
      setShowDecrypted(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  const handleDecryptNote = async () => {
    try {
      setError(null);
      const result = await decryptNote();
      setDecryptedNote(result.message);
      setShowDecrypted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decrypt note");
    }
  };

  const toggleShowDecrypted = () => {
    if (showDecrypted) {
      setShowDecrypted(false);
    } else if (decryptedNote) {
      setShowDecrypted(true);
    } else {
      void handleDecryptNote();
    }
  };

  const disabled = !backend || hasNoteLoading || !identity;

  return (
    <div className="w-full flex flex-col text-lg text-white gap-5 border p-5 bg-white/10 rounded-2xl">
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6" />
        <h2>Encrypted Note</h2>
      </div>

      <div className="text-sm opacity-90">
        Write a secure note that only you can decrypt. The example derives a
        personal VetKey for you and uses it to encrypt your note.
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {hasNote && !disabled ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-green-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              You have an encrypted note
            </span>
            <Button
              onClick={toggleShowDecrypted}
              variant="outline"
              size="sm"
              disabled={isDecrypting}
              className="flex items-center gap-2"
            >
              {isDecrypting ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Decrypting...
                </>
              ) : showDecrypted ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  View
                </>
              )}
            </Button>
          </div>

          {showDecrypted && decryptedNote && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Unlock className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  Decrypted Note:
                </span>
              </div>
              <div className="text-white whitespace-pre-wrap">
                {decryptedNote}
              </div>
            </div>
          )}

          <div className="pt-4">
            <h3 className="text-base mb-3">Update your note:</h3>
            <div className="flex flex-col gap-3">
              <Textarea
                value={noteText}
                onChange={(e) => {
                  setNoteText(e.target.value);
                }}
                placeholder="Enter your new note here (max 512 characters)..."
                className="w-full text-white text-lg min-h-32 resize-none"
                maxLength={512}
                disabled={isSaving}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-60">
                  {noteText.length}/512 characters
                </span>
                <Button
                  onClick={() => void handleSaveNote()}
                  disabled={isSaving || !noteText.trim()}
                  className="flex items-center gap-2 text-lg"
                  size={"lg"}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Encrypting...
                    </>
                  ) : (
                    <>Update Note</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Textarea
            value={noteText}
            onChange={(e) => {
              setNoteText(e.target.value);
            }}
            placeholder="Enter your secure note here (max 512 characters)..."
            className="w-full text-white text-lg min-h-32 resize-none"
            maxLength={512}
            disabled={disabled || isSaving}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-60">
              {noteText.length}/512 characters
            </span>
            <Button
              onClick={() => void handleSaveNote()}
              disabled={disabled || isSaving || !noteText.trim()}
              className="flex items-center gap-2 text-lg"
              size="lg"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>Encrypt & Save Note</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
