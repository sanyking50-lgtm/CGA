import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-red-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}