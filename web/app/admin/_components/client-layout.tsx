"use client";

import { AdminLayout } from "@/components/admin/admin-layout";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
