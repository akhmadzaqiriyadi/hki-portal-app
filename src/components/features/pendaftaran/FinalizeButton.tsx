"use client";

import { useState, useTransition } from "react";
import { finalizeRegistration } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Send, Loader2 } from "lucide-react";

import { toast } from "sonner"; 

interface FinalizeButtonProps {
  pendaftaranId: string;
}

export function FinalizeButton({ pendaftaranId }: FinalizeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleFinalize = () => {
    startTransition(async () => {
      const result = await finalizeRegistration(pendaftaranId);
      
      // ✅ PERBAIKAN: Panggil `toast.success` atau `toast.error` secara langsung
      if (result.success) {
        toast.success("Berhasil!", { 
          description: result.message 
        });
        setConfirmOpen(false);
      } else {
        toast.error("Gagal.", { 
          description: result.message 
        });
        setConfirmOpen(false);
      }
    });
  };

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah difinalisasi, pendaftaran akan dikirim untuk direview dan Anda tidak dapat mengubah datanya lagi. Pastikan semua data sudah benar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalize} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Finalisasi dan Kirim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button onClick={() => setConfirmOpen(true)} disabled={isPending}>
        <Send className="mr-2 h-4 w-4" />
        Finalisasi Pendaftaran
      </Button>
    </>
  );
}