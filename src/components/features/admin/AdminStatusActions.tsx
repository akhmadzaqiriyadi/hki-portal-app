"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRegistrationStatus } from "@/lib/supabase/actions";
import type { StatusPendaftaran } from "@/lib/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Loader2 } from "lucide-react";

interface AdminStatusActionsProps {
  pendaftaranId: string;
  currentStatus: StatusPendaftaran;
}

// ✨ REKOMENDASI: Ubah menjadi array of object untuk label yang lebih baik
const statusOptions: { value: StatusPendaftaran; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "review", label: "Review" },
  { value: "revisi", label: "Revisi" },
  { value: "diproses_hki", label: "Diproses (HKI)" }, // <-- Status baru ditambahkan
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];

// Pastikan semua status ada di sini kecuali 'draft' yang mungkin tidak bisa di-set oleh admin
const availableStatus = statusOptions.map(s => s.value);

export function AdminStatusActions({ pendaftaranId, currentStatus }: AdminStatusActionsProps) {
  // Menangani kasus jika status saat ini tidak ada di options (misal: 'draft')
  const initialStatus = availableStatus.includes(currentStatus) ? currentStatus : undefined;
  const [selectedStatus, setSelectedStatus] = useState<StatusPendaftaran | undefined>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;

    startTransition(async () => {
      const result = await updateRegistrationStatus(pendaftaranId, selectedStatus);
      if (result.success) {
        toast.success("Status berhasil diperbarui!");
        router.refresh();
      } else {
        toast.error("Gagal memperbarui status.", { description: result.message });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Edit className="w-5 h-5"/> Tindakan Admin</CardTitle>
        <CardDescription>Ubah status pendaftaran di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as StatusPendaftaran)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih status..." />
            </SelectTrigger>
            <SelectContent>
              {/* ✨ Mapping menggunakan object baru */}
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusUpdate} disabled={isPending || !selectedStatus || selectedStatus === currentStatus}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}