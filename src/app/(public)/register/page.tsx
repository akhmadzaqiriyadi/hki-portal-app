'use client';
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import Header from "@/components/landingpage/HeaderComponent";
import Footer from "@/components/landingpage/FooterComponent";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = () => {
    // Navigate to registration page
    router.push('/register');
    console.log("Navigate to register");
  };

  const handleLogin = () => {
    // Navigate to login page
    router.push('/login');
    console.log("Navigate to login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="w-full max-w-md">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link 
              href="/login" 
              className="font-medium text-blue-800 hover:text-blue-900 transition-colors underline decoration-blue-300 hover:decoration-blue-400"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}