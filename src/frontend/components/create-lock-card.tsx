import useCreateLock from "@/hooks/use-create-lock";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CreateLockCard() {
  const { mutateAsync: createLock } = useCreateLock();

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

  return (
    <div className="flex flex-col bg-[#522785] p-10 rounded-xl items-center text-lg text-white gap-5">
      <div className="text-center">
        Login with any username to access showcase, no password needed.
      </div>
      <form className="w-full flex flex-col gap-2" action={doLogin}>
        <Input
          type="text"
          name="message"
          placeholder="Message"
          className="w-full text-white-lg text-center text-lg"
          data-1p-ignore
        />
        <Input
          type="number"
          name="release_time"
          placeholder="release_time"
          className="w-full text-white-lg text-center text-lg"
          data-1p-ignore
        />
        <Button
          type="submit"
          className="w-full text-lg text-[#522785] bg-white/50"
          size={"lg"}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
