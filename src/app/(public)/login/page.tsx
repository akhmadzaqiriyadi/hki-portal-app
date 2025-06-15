import { LoginForm } from "@/components/features/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
      <div className="mt-4 text-center text-sm">
        Belum punya akun?{" "}
        <Link href="/register" className="underline">
          Daftar di sini
        </Link>
      </div>
    </div>
  );
}