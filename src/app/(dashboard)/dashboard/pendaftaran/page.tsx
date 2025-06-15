import Link from "next/link";
import { getMyRegistrations } from "@/lib/supabase/actions";
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
import { PlusCircle } from "lucide-react";
import type { StatusPendaftaran } from "@/lib/types";
import { PendaftaranActions } from "@/components/features/pendaftaran/PendaftaranActions";

const getStatusVariant = (status: StatusPendaftaran) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'revisi':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default async function PendaftaranListPage() {
  const { data: pendaftaran, error } = await getMyRegistrations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pendaftaran HKI</h1>
          <p className="text-muted-foreground">
            Semua pendaftaran yang pernah Anda ajukan ada di sini.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pendaftaran/baru">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pendaftaran Baru
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {error && <div className="p-6 text-red-500">Error: {error.message}</div>}

          {!error && pendaftaran && pendaftaran.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Judul Karya</TableHead>
                  <TableHead>Jenis Karya</TableHead>
                  <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendaftaran.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>{item.jenis_karya}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                       {/* ✅ INI PERBAIKANNYA: Kirim seluruh objek 'item' */}
                       <PendaftaranActions pendaftaran={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 px-6">
              <h3 className="text-xl font-semibold">Anda Belum Punya Pendaftaran</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Mulai daftarkan karya pertama Anda sekarang juga!
              </p>
              <Button asChild>
                <Link href="/dashboard/pendaftaran/baru">
                  <PlusCircle className="mr-2 h-4 w-4" /> Daftarkan HKI
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}