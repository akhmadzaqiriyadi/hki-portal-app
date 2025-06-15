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
import { AlertCircle, CheckCircle2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Memproses..." : "Buat Akun"}
    </Button>
  );
}

export function RegisterForm() {
  const initialState: FormState = { success: false, message: "", errors: {} };
  const [state, formAction] = useActionState(register, initialState);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Registrasi</CardTitle>
        <CardDescription>
          Buat akun baru untuk mulai mendaftarkan HKI Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Jika registrasi berhasil, tampilkan pesan sukses */}
        {state.success ? (
           <Alert variant="default" className="border-green-500 text-green-700">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Berhasil!</AlertTitle>
                <AlertDescription>
                   {state.message}
                </AlertDescription>
            </Alert>
        ) : (
          // Jika belum atau gagal, tampilkan form
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
              <Input id="nama_lengkap" name="nama_lengkap" placeholder="Nama Anda" required />
              {state.errors?.nama_lengkap && <p className="text-xs font-medium text-destructive">{state.errors.nama_lengkap[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
              {state.errors?.email && <p className="text-xs font-medium text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && <p className="text-xs font-medium text-destructive">{state.errors.password[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
              {state.errors?.confirmPassword && <p className="text-xs font-medium text-destructive">{state.errors.confirmPassword[0]}</p>}
            </div>
            
            {!state.success && state.message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Gagal Registrasi</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <SubmitButton />
          </form>
        )}
      </CardContent>
    </Card>
  );
}