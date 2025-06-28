"use client";

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { register, type FormState } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, User, Mail, Lock, UserPlus } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      type="submit" 
      disabled={pending} 
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Memproses...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Buat Akun
        </>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const initialState: FormState = { success: false, message: "", errors: {} };
  const [state, formAction] = useActionState(register, initialState);

  return (
    <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
          Bergabung dengan UTY HKI
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          Daftarkan akun Anda untuk mulai mengelola hak kekayaan intelektual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jika registrasi berhasil, tampilkan pesan sukses */}
        {state.success ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <Alert variant="default" className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Registrasi Berhasil!</AlertTitle>
              <AlertDescription className="text-green-700">
                {state.message}
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-xl transition-all duration-200"
                onClick={() => window.location.href = '/login'}
              >
                Lanjut ke Login
              </Button>
            </div>
          </div>
        ) : (
          // Jika belum atau gagal, tampilkan form
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nama_lengkap" className="text-sm font-medium text-slate-700">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="nama_lengkap" 
                  name="nama_lengkap" 
                  placeholder="Masukkan nama lengkap Anda"
                  className="pl-10 h-11 border-slate-200 focus:border-blue-800 focus:ring-blue-800/20 rounded-xl"
                  required 
                />
              </div>
              {state.errors?.nama_lengkap && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {state.errors.nama_lengkap[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="nama@email.com"
                  className="pl-10 h-11 border-slate-200 focus:border-blue-800 focus:ring-blue-800/20 rounded-xl"
                  required 
                />
              </div>
              {state.errors?.email && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className="pl-10 h-11 border-slate-200 focus:border-blue-800 focus:ring-blue-800/20 rounded-xl"
                  required 
                />
              </div>
              {state.errors?.password && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  placeholder="Ulangi password Anda"
                  className="pl-10 h-11 border-slate-200 focus:border-blue-800 focus:ring-blue-800/20 rounded-xl"
                  required 
                />
              </div>
              {state.errors?.confirmPassword && (
                <p className="text-xs font-medium text-red-600 mt-1">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>
            
            {!state.success && state.message && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-800">Gagal Registrasi</AlertTitle>
                <AlertDescription className="text-red-700">
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-2">
              <SubmitButton />
            </div>

            <div className="text-center text-xs text-slate-500 leading-relaxed">
              Dengan mendaftar, Anda menyetujui{" "}
              <a href="#" className="text-blue-800 hover:text-blue-900 underline">
                Ketentuan Layanan
              </a>
              {" "}dan{" "}
              <a href="#" className="text-blue-800 hover:text-blue-900 underline">
                Kebijakan Privasi
              </a>
              {" "}UTY Creative Hub.
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}