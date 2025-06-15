"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRegistration } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Trash2, Edit, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Pendaftaran } from "@/lib/types";

interface PendaftaranActionsProps {
  pendaftaran: Pendaftaran;
}

export function PendaftaranActions({ pendaftaran }: PendaftaranActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  // ✅ Ambil id dan status dari objek pendaftaran
  const { id: pendaftaranId, status } = pendaftaran;
  const isDraft = status === "draft";

  const handleDelete = () => {
    startTransition(async () => {
      // Gunakan pendaftaranId yang sudah kita ambil
      const result = await deleteRegistration(pendaftaranId);
      if (result.success) {
        toast.success("Berhasil!", { description: result.message });
      } else {
        toast.error("Gagal.", { description: result.message });
      }
      setConfirmOpen(false);
    });
  };

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah Anda Yakin Ingin Menghapus?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak dapat dibatalkan. Hanya lakukan pada pendaftaran
              yang berstatus Draf.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/pendaftaran/${pendaftaranId}`)
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>{isDraft ? "Review & Finalisasi" : "Lihat Detail"}</span>
          </DropdownMenuItem>

          {isDraft && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/pendaftaran/${pendaftaranId}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
