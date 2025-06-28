import Link from "next/link";
import { getAllRegistrations } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";

// Helper untuk Badge Status
const getStatusVariant = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved":
      return "success";
    case "diproses_hki":
      return "info";
    case "revisi":
      return "destructive";
    case "submitted":
      return "warning";
    default:
      return "secondary";
  }
};


export default async function AdminPendaftaranPage() {
  const { data: pendaftaran, error } = await getAllRegistrations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Verifikasi Pendaftaran</h1>
          <p className="text-muted-foreground">
            Review dan kelola semua pendaftaran HKI yang masuk dari pengguna.
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {error && <div className="p-6 text-red-500">Error: {error.message}</div>}

          {!error && pendaftaran && pendaftaran.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Judul Karya</TableHead>
                  <TableHead>Pemohon</TableHead>
                  <TableHead className="hidden lg:table-cell">Tanggal Diajukan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendaftaran.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>{item.users?.nama_lengkap || 'N/A'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)} className="capitalize">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                       <Button asChild size="sm" variant="outline">
                         {/* Link ke halaman detail admin yang akan kita buat nanti */}
                         <Link href={`/admin/pendaftaran/${item.id}`}>
                           <Eye className="mr-2 h-4 w-4" /> Review
                         </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 px-6">
              <h3 className="text-xl font-semibold">Belum Ada Pendaftaran Masuk</h3>
              <p className="text-muted-foreground mt-2">
                Saat ini belum ada data pendaftaran dari pengguna.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}