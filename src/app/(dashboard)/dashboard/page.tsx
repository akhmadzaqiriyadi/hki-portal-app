import Link from "next/link";
import { getMyRegistrations } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, FileText } from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";

/**
 * Helper untuk memberikan warna pada Badge Status
 */
const getStatusVariant = (status: StatusPendaftaran) => {
  switch (status) {
    case "approved": return "success";
    case "revisi": return "destructive";
    case "submitted": return "warning";
    default: return "secondary";
  }
};


export default async function DashboardPage() {
  const { data: pendaftaran, error } = await getMyRegistrations();

  if (error) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dashboard Pendaftaran HKI</CardTitle>
            <CardDescription>
              Lihat dan kelola semua pendaftaran HKI Anda di sini.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/pendaftaran/baru">
              <PlusCircle className="mr-2 h-4 w-4" /> Daftarkan HKI Baru
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pendaftaran && pendaftaran.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Karya</TableHead>
                  <TableHead>Jenis Karya</TableHead>
                  <TableHead className="hidden md:table-cell">Tanggal Pengajuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendaftaran.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>{item.jenis_karya}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button asChild size="sm" variant="outline">
                         <Link href={`/dashboard/pendaftaran/${item.id}`}>
                           <FileText className="mr-2 h-4 w-4" /> Lihat Detail
                         </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Anda belum memiliki pendaftaran.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}