import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getToken } from "@/lib/api";

export function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, [location.pathname]);

  return (
    <header className="bg-brand-navy text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/">
          <p className="text-2xl font-bold tracking-tight">NKEM AERONAUTICS LTD</p>
          <p className="mt-1 text-sm italic text-brand-gold">
            "Where fate and human glory lead, we are always there."
          </p>
        </Link>
        <ul className="flex items-center gap-8 text-sm font-medium">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/logbook">Logbook Portal</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            {isLoggedIn ? <Link to="/logbook">My Dashboard</Link> : <Link to="/login">Log In</Link>}
          </li>
        </ul>
      </nav>
    </header>
  );
}
