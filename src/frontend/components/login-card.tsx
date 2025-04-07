import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useIdentityStore } from "@/state/identity";

export default function LoginCard() {
  const identity = useIdentityStore((state) => state.identity);
  const login = useIdentityStore((state) => state.login);

  const doLogin = async (formData: FormData) => {
    await login(formData.get("username") as string);
  };

  if (identity) {
    return null;
  }

  return (
    <div className="flex flex-col bg-[#522785] p-10 rounded-xl items-center text-lg text-white gap-5">
      <div className="text-center">
        Login with any username to access showcase, no password needed.
      </div>
      <form className="w-full flex flex-col gap-2" action={doLogin}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
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
