import { Link, useLocation } from "@tanstack/react-router";
import { Mail, Timer, Home, FileText } from "lucide-react";

export default function NavButtons() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="flex justify-center items-center w-full gap-3">
      <Link to="/">
        <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
          <Home className="w-8 h-8 flex-shrink-0" />
        </div>
      </Link>
      <Link to="/timelock">
        <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
          <Timer className="w-8 h-8 flex-shrink-0" />
        </div>
      </Link>
      <Link to="/encrypted-notes">
        <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
          <FileText className="w-8 h-8 flex-shrink-0" />
        </div>
      </Link>
      <Link to="/message">
        <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
          <Mail className="w-8 h-8 flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}
