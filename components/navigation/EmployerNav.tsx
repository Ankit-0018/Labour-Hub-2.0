"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User, Briefcase } from "lucide-react";

export function EmployerNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "घर / Home", href: "/employer/home", icon: Home },
    { label: "काम / Jobs", href: "/employer/jobs", icon: Briefcase },
    { label: "पोस्ट / Post", href: "/employer/post-job", icon: PlusCircle },
    { label: "प्रोफाइल / Profile", href: "/employer/profile", icon: User },
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

