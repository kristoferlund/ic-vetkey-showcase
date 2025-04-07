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
    <div className="flex flex-col bg-[#9a0063]/50 p-5 rounded-xl text-lg text-white gap-5">
      <h2>Login</h2>
      <div>
        Login with any username to access all showcase functionality, no
        password needed.
      </div>
      <form className="w-full flex flex-col gap-3" action={doLogin}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full text-white-lg text-lg"
          data-1p-ignore
        />
        <Button type="submit" className="w-full text-lg" size={"lg"}>
          Login
        </Button>
      </form>
    </div>
  );
}
