import { useIdentityStore } from "@/state/identity";
import { Button } from "@/components/ui/button";
import { useGetUserKey } from "@/hooks/use-get-user-key";

export default function Header() {
  const identity = useIdentityStore((state) => state.identity);
  const username = useIdentityStore((state) => state.username);
  const logout = useIdentityStore((state) => state.logout);

  useGetUserKey(); // Hack to ensure user key is always available

  if (!identity) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 text-white h-12 flex items-center px-4">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-[#9a0063]/50 rounded-full text-sm">
          {username}
        </span>
        <Button variant="outline" size="sm" onClick={() => void logout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
