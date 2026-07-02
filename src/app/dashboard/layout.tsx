import type { Metadata } from "next";
import DashboardInnerLayout from "./dashboard-inner-layout";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardInnerLayout>{children}</DashboardInnerLayout>;
}