import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  LoaderCircle,
  Mail,
  Send,
  Inbox,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import { useBackendActor } from "@/backend-actor";
import { useMessageSend } from "../hooks/use-message-send";
import { useMessageListReceived } from "../hooks/use-message-list-received";
import { useMessageListSent } from "../hooks/use-message-list-sent";
import { useMessageDecryptReceived } from "../hooks/use-message-decrypt-received";
import { useMessageDecryptSent } from "../hooks/use-message-decrypt-sent";
import { useState } from "react";
import { useIdentityStore } from "@/state/identity";
import { useGetUserKey } from "@/hooks/use-get-user-key";

type TabType = "inbox" | "outbox" | "compose";

export default function MessageCard() {
  const { actor: backend } = useBackendActor();
  const { mutateAsync: sendMessage, isPending: isSending } = useMessageSend();
  const { data: receivedMessages, isLoading: receivedLoading } =
    useMessageListReceived();
  const { data: sentMessages, isLoading: sentLoading } = useMessageListSent();
  const { mutateAsync: decryptReceived, isPending: isDecryptingReceived } =
    useMessageDecryptReceived();
  const { mutateAsync: decryptSent, isPending: isDecryptingSent } =
    useMessageDecryptSent();
  const identity = useIdentityStore((state) => state.identity);
  const { isPending: userKeyPending } = useGetUserKey();

  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [messageText, setMessageText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [decryptedMessages, setDecryptedMessages] = useState<
    Record<string, string>
  >({});
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(
    new Set(),
  );

  const handleSendMessage = async () => {
    try {
      setError(null);

      if (!recipient.trim()) {
        throw new Error("Recipient is required");
      }

      if (!recipient.trim()) {
        throw new Error("Recipient username is required");
      }

      await sendMessage({
        message: messageText,
        recipient: recipient.trim(),
      });

      setMessageText("");
      setRecipient("");
      setActiveTab("outbox");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const handleDecryptMessage = async (
    messageId: number,
    encryptedData: number[],
    type: "received" | "sent",
  ) => {
    try {
      setError(null);
      const key = `${type}-${messageId.toString()}`;

      if (decryptedMessages[key]) {
        // Toggle visibility
        const newVisible = new Set(visibleMessages);
        if (newVisible.has(key)) {
          newVisible.delete(key);
        } else {
          newVisible.add(key);
        }
        setVisibleMessages(newVisible);
        return;
      }

      const result =
        type === "received"
          ? await decryptReceived({ messageId, encryptedData })
          : await decryptSent({ messageId, encryptedData });

      setDecryptedMessages((prev) => ({
        ...prev,
        [key]: result.message,
      }));

      setVisibleMessages((prev) => new Set([...prev, key]));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to decrypt message",
      );
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const disabled = !backend || !identity || userKeyPending;

  return (
    <div className="w-full flex flex-col text-lg text-white gap-5 border p-5 bg-white/10 rounded-2xl">
      <div className="flex items-center gap-2">
        <Mail className="w-6 h-6" />
        <h2>Messages</h2>
      </div>

      <div>
        Send encrypted messages to other users. Inbox shows messages sent to
        you, Outbox shows messages you&apos;ve sent.
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-black/20 rounded-lg p-1">
        <button
          onClick={() => {
            setActiveTab("inbox");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-xs ${
            activeTab === "inbox"
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Inbox
          {receivedMessages && receivedMessages.length > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {receivedMessages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("outbox");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-xs ${
            activeTab === "outbox"
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <Send className="w-4 h-4" />
          Sent
          {sentMessages && sentMessages.length > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {sentMessages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("compose");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-xs ${
            activeTab === "compose"
              ? "bg-white/20 text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Compose
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "inbox" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-medium">Received Messages</h3>
          {receivedLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="w-6 h-6 animate-spin" />
            </div>
          ) : receivedMessages && receivedMessages.length > 0 ? (
            <div className="space-y-3">
              {receivedMessages.map((message) => {
                const key = `received-${message.id.toString()}`;
                const isDecrypted = !!decryptedMessages[key];
                const isVisible = visibleMessages.has(key);

                return (
                  <div
                    key={message.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          From: {message.sender}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          void handleDecryptMessage(
                            Number(message.id),
                            Array.from(message.encrypted_data),
                            "received",
                          )
                        }
                        variant="outline"
                        size="sm"
                        disabled={disabled || isDecryptingReceived}
                        className="flex items-center gap-2"
                      >
                        {isDecryptingReceived ? (
                          <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Decrypting...
                          </>
                        ) : isVisible ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            {isDecrypted ? "Show" : "Decrypt"}
                          </>
                        )}
                      </Button>
                    </div>
                    {isVisible && decryptedMessages[key] && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-2">
                        <div className="text-white whitespace-pre-wrap">
                          {decryptedMessages[key]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              No messages received yet
            </div>
          )}
        </div>
      )}

      {activeTab === "outbox" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-medium">Sent Messages</h3>
          {sentLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="w-6 h-6 animate-spin" />
            </div>
          ) : sentMessages && sentMessages.length > 0 ? (
            <div className="space-y-3">
              {sentMessages.map((message) => {
                const key = `sent-${message.id.toString()}`;
                const isDecrypted = !!decryptedMessages[key];
                const isVisible = visibleMessages.has(key);

                return (
                  <div
                    key={message.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          To: {message.recipient}
                        </span>
                        <span className="text-xs opacity-60">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          void handleDecryptMessage(
                            Number(message.id),
                            Array.from(message.encrypted_data),
                            "sent",
                          )
                        }
                        variant="outline"
                        size="sm"
                        disabled={disabled || isDecryptingSent}
                        className="flex items-center gap-2"
                      >
                        {isDecryptingSent ? (
                          <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Decrypting...
                          </>
                        ) : isVisible ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            {isDecrypted ? "Show" : "Decrypt"}
                          </>
                        )}
                      </Button>
                    </div>
                    {isVisible && decryptedMessages[key] && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-2">
                        <div className="text-white whitespace-pre-wrap">
                          {decryptedMessages[key]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              No messages sent yet
            </div>
          )}
        </div>
      )}

      {activeTab === "compose" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-medium">Compose New Message</h3>
          <div className="flex flex-col gap-3">
            <Input
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              placeholder="Recipient Username"
              className="w-full text-white text-lg"
              disabled={disabled || isSending}
            />
            <Textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
              }}
              placeholder="Enter your message here..."
              className="w-full text-white text-lg min-h-32 resize-none"
              disabled={disabled || isSending}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-60">
                {messageText.length} characters
              </span>
              <Button
                onClick={() => {
                  void handleSendMessage();
                }}
                disabled={
                  disabled ||
                  isSending ||
                  !messageText.trim() ||
                  !recipient.trim()
                }
                className="flex items-center gap-2 text-lg"
                size="lg"
              >
                {isSending ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send Message</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
