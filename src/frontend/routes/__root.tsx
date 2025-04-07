import LoginCard from "@/components/login-card";
import icLogo from "../assets/ic.svg";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <main className="dark">
      <div className="flex flex-col gap-14 items-center w-[400px]">
        <div className="flex gap-10">
          <a
            href="https://internetcomputer.org"
            target="_blank"
            rel="noreferrer"
          >
            <img src={icLogo} alt="ICP logo" className="h-20" />
          </a>
        </div>
        <h1>VetKeys Showcase</h1>
        <div className="flex gap-5 text-white underline">
          <Link to="/">/home</Link>
          <Link to="/timelock">/timelock</Link>
        </div>
        <LoginCard />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </main>
  ),
});
