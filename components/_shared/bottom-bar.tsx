"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  LayoutGrid,
  History,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Earning", href: "/earning", icon: LayoutGrid },
  { label: "History", href: "/history", icon: History },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 border-t border-gray-300 md:hidden">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon
                size={22}
                className={isActive ? "text-blue-500" : "text-gray-500"}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-blue-500 font-medium" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
