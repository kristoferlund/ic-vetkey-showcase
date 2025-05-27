import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

import Header from "@/components/header";
import LoginCard from "@/components/login-card";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import icLogo from "../assets/ic.svg";
import NavButtons from "@/components/nav-buttons";

export const Route = createRootRoute({
  component: () => (
    <main className="dark bg-black text-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full py-10">
        <div className="flex flex-col items-center gap-10 mt-20 w-[400px]">
          <Link to="/">
            <img src={icLogo} alt="ICP logo" className="h-20" />
          </Link>
          <h1 className="text-xl font-semibold">VetKeys Showcase</h1>
          <NavButtons />
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
