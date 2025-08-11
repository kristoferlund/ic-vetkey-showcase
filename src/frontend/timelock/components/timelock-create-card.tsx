import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTimeLockCreate } from "../hooks/use-timelock-create";
import { LoaderCircle, Timer } from "lucide-react";
import { useBackendActor } from "@/main";

export default function TimeLockCreateCard() {
  const { mutateAsync: createLock, isPending } = useTimeLockCreate();
  const { actor: backend } = useBackendActor();

  const doCreateLock = async (formData: FormData) => {
    const releaseTimeSeconds = Number(formData.get("release_time"));

    if (Number.isNaN(releaseTimeSeconds)) {
      throw new Error("Invalid release time");
    }

    await createLock({
      message: formData.get("message") as string,
      releaseTimeSeconds,
    });
  };

  const disabled = isPending || !backend;

  return (
    <div className="w-full flex flex-col text-lg text-white gap-5 border p-5 bg-white/10 rounded-2xl">
      <div className="flex items-center gap-2">
        <Timer className="w-6 h-6" />
        <h2>Timelock</h2>
      </div>
      <div>
        Encrypt a message and set a release time. After the release time, anyone
        can decrypt the message.
      </div>
      <form className="w-full flex flex-col gap-3" action={doCreateLock}>
        <Input
          type="text"
          name="message"
          placeholder="Message"
          className="w-full text-white-lg text-lg"
          data-1p-ignore
          disabled={disabled}
        />
        <Input
          type="number"
          name="release_time"
          placeholder="Release time in seconds"
          className="w-full text-white-lg text-lg"
          data-1p-ignore
          disabled={disabled}
        />
        <Button
          type="submit"
          className="w-full text-lg"
          size={"lg"}
          disabled={disabled}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              Encrypting...
            </>
          ) : (
            "Encrypt and lock"
          )}
        </Button>
      </form>
    </div>
  );
}
