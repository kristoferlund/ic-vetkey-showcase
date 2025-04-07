import { Link } from "@tanstack/react-router";

export default function HomeButtonCard() {
  return (
    <div className="flex items-center">
      <Link to="/" className="underline">
        Home
      </Link>
    </div>
  );
}
