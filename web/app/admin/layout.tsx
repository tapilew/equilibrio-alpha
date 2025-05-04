import type { Metadata } from "next";
import { ClientLayout } from "./_components/client-layout";

export const metadata: Metadata = {
  title: "Admin Dashboard - EquiProtocol",
  description: "EquiProtocol Admin Dashboard",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
