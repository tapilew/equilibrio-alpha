import { AdminLayout } from "@/components/admin/admin-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - EquiProtocol",
  description: "EquiProtocol Admin Dashboard",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
