"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the actual Providers component only on the client
const Providers = dynamic(
  () => import("@/components/Providers").then((mod) => mod.Providers),
  { ssr: false },
);

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  // Render the dynamically imported Providers component
  return <Providers>{children}</Providers>;
}
