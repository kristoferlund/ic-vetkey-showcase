import { useTimeLockList } from "@/timelock/hooks/use-timelock-list";
import { useTimeLockOpen } from "@/timelock/hooks/use-timelock-open";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Lock, LockOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useBackendActor } from "@/backend-actor";

function Countdown({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(target.getTime() - Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [target]);

  if (timeLeft <= 0) return null;

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor(timeLeft / 1000 / 60 / 60);

  return (
    <div className="text-sm text-gray-300">
      Unlocks in: {hours}h {minutes}m {seconds}s
    </div>
  );
}

export default function TimeLockListCard() {
  const { data: timeLockList } = useTimeLockList();
  const { mutate: openLock, isPending, variables } = useTimeLockOpen();
  const { actor: backend } = useBackendActor();

  const [now, setNow] = useState(() => new Date());

  // Force a re-render every second to refresh time-based state
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!timeLockList) return null;

  return (
    <div className="w-full flex flex-col gap-5">
      {timeLockList.map((lock) => {
        const released = lock.date <= now;

        const isUnlocked = !lock.locked && released;
        const isReleasedButLocked = lock.locked && released;
        const isStillLocked = lock.locked && !released;
        const isThisPending =
          isPending && variables.lock_id === lock.timelock_id;

        return (
          <div
            key={lock.timelock_id}
            className="bg-white/10 p-6 rounded-xl w-full max-w-md flex flex-col items-center gap-3 text-center shadow-lg"
          >
            <div className="text-2xl">
              {isUnlocked ? (
                <LockOpen className="text-green-400" />
              ) : (
                <Lock
                  className={
                    isReleasedButLocked ? "text-yellow-400" : "text-gray-400"
                  }
                />
              )}
            </div>

            <div className="text-base">
              Message:{" "}
              {isUnlocked
                ? new TextDecoder().decode(lock.data as Uint8Array)
                : "🔒 Hidden until unlocked"}
            </div>

            <div className="text-sm text-gray-300">
              Release Time: {lock.date.toLocaleTimeString()}
            </div>

            {isStillLocked && <Countdown target={lock.date} />}

            {isReleasedButLocked && (
              <Button
                onClick={() => {
                  openLock({ lock_id: lock.timelock_id });
                }}
                className="mt-2"
                disabled={isThisPending || !backend}
              >
                {isThisPending ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock"
                )}
              </Button>
            )}

            {isStillLocked && (
              <Button disabled className="opacity-50 mt-2 cursor-not-allowed">
                Unlock
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
