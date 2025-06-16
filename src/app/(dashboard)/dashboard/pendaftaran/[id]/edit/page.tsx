import { getRegistrationById } from "@/lib/supabase/actions";
import { notFound, redirect } from "next/navigation";
import { PendaftaranBaruForm } from "@/components/features/pendaftaran/PendaftaranBaruForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function EditPendaftaranPage({
  params,
}: {
  // Tipe props tidak perlu diubah, Next.js menangani ini secara internal
  params: { id: string };
}) {
  // ✅ PERBAIKAN UTAMA: 'await' params sebelum mengambil propertinya
  const { id } = await params;

  // Gunakan 'id' yang sudah di-await untuk mengambil data
  const { data: pendaftaran, error } = await getRegistrationById(id);

  if (error || !pendaftaran) {
    notFound();
  }

  // Keamanan: Hanya izinkan edit jika statusnya 'draft'
  if (pendaftaran.status !== "draft") {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Akses Ditolak</AlertTitle>
          <AlertDescription>
            Pendaftaran ini sudah tidak bisa diubah karena telah difinalisasi
            atau sedang dalam proses review.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Merender form yang sama, tapi dengan mengirimkan data awal
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Pendaftaran HKI</h1>
      <PendaftaranBaruForm
        initialData={pendaftaran}
        pendaftaranId={pendaftaran.id}
      />
    </div>
  );
}
