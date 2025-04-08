import { Link, useLocation } from "@tanstack/react-router";

export default function HomeButtonCard() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="flex items-center">
      <Link to="/" className="underline">
        Home
      </Link>
    </div>
  );
}
