"use client";

import { ReactNode, useEffect, useState } from "react";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
