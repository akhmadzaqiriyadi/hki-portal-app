'use client'

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

// Impor Server Action `login` dan tipe datanya
import { login, type FormState } from "@/lib/supabase/actions"

// Impor semua komponen UI dari shadcn/ui
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Impor ikon untuk komponen Alert
import { AlertCircle, Lock, Mail } from "lucide-react"

/**
 * Komponen Tombol Submit terpisah.
 * Menggunakan `useFormStatus` dari `react-dom` untuk mendeteksi status pengiriman form.
 */
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Memproses...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4 mr-2" />
          Masuk
        </>
      )}
    </Button>
  )
}

/**
 * Komponen utama Form Login.
 * Terhubung dengan Server Action `login` menggunakan `useActionState`.
 */
export function LoginForm() {
  // State awal untuk validasi dan pesan
  const initialState: FormState = { success: false, message: "", errors: {} }

  // Gunakan Server Action untuk form
  const [state, formAction] = useActionState(login, initialState)

  return (
    <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
          Selamat Datang
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          Masuk ke Portal UTY HKI untuk mengelola hak kekayaan intelektual Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-5">
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
                placeholder="Masukkan password Anda"
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

          {!state.success && state.message && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-800">Gagal Masuk</AlertTitle>
              <AlertDescription className="text-red-700">
                {state.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        <div className="text-center">
          <a 
            href="#" 
            className="text-sm text-blue-800 hover:text-blue-900 transition-colors font-medium"
          >
            Lupa password?
          </a>
        </div>
      </CardContent>
    </Card>
  )
}