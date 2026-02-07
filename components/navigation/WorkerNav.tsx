"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Wallet, User } from "lucide-react";

export function WorkerNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "घर / Home", href: "/worker/home", icon: Home },
    { label: "खोज / Search", href: "/worker/search", icon: Search },
    { label: "कमाई / Earnings", href: "/worker/earnings", icon: Wallet },
    { label: "प्रोफाइल / Profile", href: "/worker/profile", icon: User },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <Icon className="bottom-nav-icon" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
