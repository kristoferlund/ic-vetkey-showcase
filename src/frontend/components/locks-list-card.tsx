import useTimeLockList from "@/hooks/use-timelock-list";
import { Button } from "./ui/button";
import useOpenLock from "@/hooks/use-open-lock";

export default function LocksListCard() {
  const { data: timeLockList } = useTimeLockList();
  const { mutate: openLock } = useOpenLock();

  if (!timeLockList) {
    return null;
  }

  return (
    <div className="flex flex-col bg-[#522785] p-10 rounded-xl items-center text-lg text-white gap-5">
      {timeLockList.map((lock) => (
        <div key={lock.timelock_id} className="text-center">
          <div>
            Message:{" "}
            {lock.locked ? "XXXXXX" : new TextDecoder().decode(lock.data)}
          </div>
          <div>Release Time: {lock.date.toLocaleTimeString()}</div>
          <Button onClick={() => openLock({ lock_id: lock.timelock_id })}>
            Open Lock
          </Button>
        </div>
      ))}
    </div>
  );
}
