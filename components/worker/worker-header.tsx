"use client";

import { Link } from "lucide-react";
import { LanguageToggle } from "../_shared/language-toggle";

type Props = {
  title: string;
};

export function WorkerHeader({ title }: Props) {
  return (
    <div className="worker-header">
      <div className="worker-header-content">
        <h1 className="worker-header-title">{title}</h1>
        <div className="worker-header-actions">
          <LanguageToggle />
          <Link href="/worker/home#notifications">🔔</Link>
        </div>
      </div>
    </div>
  );
}