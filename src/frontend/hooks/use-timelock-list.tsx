import { useQuery } from "@tanstack/react-query";
import { backend } from "../../backend/declarations/index";
import { TimeLock } from "src/backend/declarations/backend.did";

type TimeLockExtended = TimeLock & {
  date: Date;
};

export default function useTimeLockList() {
  return useQuery({
    queryKey: ["timelock_list"],
    queryFn: async (): Promise<TimeLockExtended[]> => {
      const locks = await backend.timelock_list();

      const timeLockList = locks.map((lock) => {
        const lockDate = new Date(Number(lock.key_id / 1_000_000n));
        return {
          ...lock,
          date: lockDate,
        };
      });

      return timeLockList;
    },
  });
}
