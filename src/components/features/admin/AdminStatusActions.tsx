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

const statusOptions: StatusPendaftaran[] = ["submitted", "review", "revisi", "approved", "rejected"];

export function AdminStatusActions({ pendaftaranId, currentStatus }: AdminStatusActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusPendaftaran>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = () => {
    startTransition(async () => {
      const result = await updateRegistrationStatus(pendaftaranId, selectedStatus);
      if (result.success) {
        toast.success("Status berhasil diperbarui!");
        // Refresh halaman untuk melihat perubahan
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
              {statusOptions.map(status => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusUpdate} disabled={isPending || selectedStatus === currentStatus}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}