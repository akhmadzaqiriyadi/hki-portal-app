import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <RegisterForm />
      <div className="mt-4 text-center text-sm">
        Sudah punya akun?{" "}
        <Link href="/login" className="underline">
          Login di sini
        </Link>
      </div>
    </div>
  );
}