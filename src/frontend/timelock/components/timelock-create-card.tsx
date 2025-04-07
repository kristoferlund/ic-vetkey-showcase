import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTimeLockCreate from "../hooks/use-timelock-create";
import { LoaderCircle } from "lucide-react";
import { useBackendActor } from "@/backend-actor";

export default function TimeLockCreateCard() {
  const { mutateAsync: createLock, isPending } = useTimeLockCreate();
  const { actor: backend } = useBackendActor();

  const doLogin = async (formData: FormData) => {
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
    <div className="w-full flex flex-col items-center text-lg text-white gap-5">
      <form className="w-full flex flex-col gap-3" action={doLogin}>
        <Input
          type="text"
          name="message"
          placeholder="Message"
          className="w-full text-white-lg text-center text-lg"
          data-1p-ignore
          disabled={disabled}
        />
        <Input
          type="number"
          name="release_time"
          placeholder="Release time in seconds"
          className="w-full text-white-lg text-center text-lg"
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
