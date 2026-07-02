import type { Metadata } from "next";
import AdminInnerLayout from "./admin-inner-layout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminInnerLayout>{children}</AdminInnerLayout>;
}