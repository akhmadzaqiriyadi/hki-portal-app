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
import { AlertCircle } from "lucide-react"

/**
 * Komponen Tombol Submit terpisah.
 * Menggunakan `useFormStatus` dari `react-dom` untuk mendeteksi status pengiriman form.
 */
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      className="w-full"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? "Memproses..." : "Login"}
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
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Masukkan email dan password Anda untuk mengakses dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              required
            />
            {state.errors?.email && (
              <p className="text-xs font-medium text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state.errors?.password && (
              <p className="text-xs font-medium text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {!state.success && state.message && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Gagal Login</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
