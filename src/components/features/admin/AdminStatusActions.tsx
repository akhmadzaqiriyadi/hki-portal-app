"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRegistrationStatus } from "@/lib/supabase/actions";
import type { StatusPendaftaran } from "@/lib/types";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // <-- Import Textarea
import { Label } from "@/components/ui/label"; // <-- Import Label
import { Edit, Loader2 } from "lucide-react";

interface AdminStatusActionsProps {
  pendaftaranId: string;
  currentStatus: StatusPendaftaran;
  currentRevisionNote?: string | null; // <-- Prop baru untuk menerima catatan
}

const statusOptions: { value: StatusPendaftaran; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "review", label: "Review" },
  { value: "revisi", label: "Revisi" },
  { value: "diproses_hki", label: "Diproses (HKI)" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function AdminStatusActions({
  pendaftaranId,
  currentStatus,
  currentRevisionNote, // <-- Terima prop baru
}: AdminStatusActionsProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<StatusPendaftaran>(currentStatus);
  // State baru untuk catatan revisi
  const [revisionNote, setRevisionNote] = useState(currentRevisionNote || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = () => {
    // Validasi: jangan proses jika status tidak berubah
    if (selectedStatus === currentStatus && selectedStatus !== 'revisi') return;

    // Validasi: Jika status adalah revisi, catatan tidak boleh kosong
    if (selectedStatus === 'revisi' && !revisionNote.trim()) {
      toast.error("Catatan revisi tidak boleh kosong.");
      return;
    }

    startTransition(async () => {
      const result = await updateRegistrationStatus({
        id: pendaftaranId,
        status: selectedStatus,
        // Kirim catatan hanya jika status 'revisi', jika tidak kirim null untuk membersihkan
        catatan_revisi: selectedStatus === 'revisi' ? revisionNote : null
      });

      if (!result.success) {
        toast.error("Gagal memperbarui status.", {
          description: result.message,
        });
      } else {
        toast.success("Status berhasil diperbarui!");
        router.refresh(); // Muat ulang halaman untuk melihat perubahan
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" /> Tindakan Admin
        </CardTitle>
        <CardDescription>
          Ubah status pendaftaran. Jika memilih 'Revisi', wajib mengisi catatan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-grow min-w-[180px]">
            <Label htmlFor="status-select">Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as StatusPendaftaran)}
            >
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Pilih status..." />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleStatusUpdate}
            disabled={
              isPending ||
              // Nonaktifkan jika status tidak berubah ATAU jika status 'revisi' tapi catatan kosong
              (selectedStatus === currentStatus && (selectedStatus !== 'revisi' || revisionNote === (currentRevisionNote || ''))) ||
              (selectedStatus === 'revisi' && !revisionNote.trim())
            }
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
        
        {/* Tampilkan Textarea HANYA jika status adalah 'revisi' */}
        {selectedStatus === "revisi" && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="revision-note">Catatan Revisi (Wajib Diisi)</Label>
            <Textarea
              id="revision-note"
              placeholder="Contoh: Scan KTP pencipta kedua buram, mohon unggah ulang."
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              disabled={isPending}
              rows={4}
              className="bg-background"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}