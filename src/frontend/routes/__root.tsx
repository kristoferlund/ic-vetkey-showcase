import LoginCard from "@/components/login-card";
import icLogo from "../assets/ic.svg";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/header";

export const Route = createRootRoute({
  component: () => (
    <main className="dark bg-black text-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full py-10">
        <div className="flex flex-col items-center gap-10 mt-20 w-[400px]">
          <a
            href="https://internetcomputer.org"
            target="_blank"
            rel="noreferrer"
          >
            <img src={icLogo} alt="ICP logo" className="h-20" />
          </a>
          <h1 className="text-xl font-semibold">VetKeys Showcase</h1>
          <nav className="flex gap-5 underline">
            <Link to="/">/home</Link>
            <Link to="/timelock">/timelock</Link>
          </nav>
          <LoginCard />
        </div>

        <div className="mt-10 w-full flex justify-center px-4">
          <div className="w-full max-w-[400px]">
            <Outlet />
          </div>
        </div>

        <TanStackRouterDevtools />
      </div>
    </main>
  ),
});
