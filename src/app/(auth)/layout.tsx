import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Create Growth Agency",
  description: "Sign in to your Create Growth Agency account",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080E1A] p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}