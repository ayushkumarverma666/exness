"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/trade", label: "Trade" },
  { href: "/markets", label: "Markets" },
  { href: "/help", label: "Help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm transition-colors hover:text-fg",
                  pathname === n.href ? "text-fg" : "text-muted"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted">{user?.name}</span>
              <button
                onClick={() => logout.mutate()}
                className="rounded-md border border-line-2 px-4 py-2 text-sm text-fg hover:bg-panel-2"
              >
                Log out
              </button>
              <Link href="/trade" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
                Open terminal
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 text-sm text-fg hover:text-white">
                Log in
              </Link>
              <Link href="/register" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90">
                Open free account
              </Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-4 pb-6 md:hidden">
          <nav className="flex flex-col py-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-fg">
                {n.label}
              </Link>
            ))}
          </nav>
          {isAuthenticated ? (
            <button onClick={() => logout.mutate()} className="w-full rounded-md border border-line-2 py-3 text-sm">
              Log out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" className="rounded-md border border-line-2 py-3 text-center text-sm">
                Log in
              </Link>
              <Link href="/register" className="rounded-md bg-accent py-3 text-center text-sm font-medium text-white">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
