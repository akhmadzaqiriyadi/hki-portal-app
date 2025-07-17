"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadSertifikatHKI, deleteSertifikatHKI } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

interface SertifikatUploadProps {
  pendaftaranId: string;
  currentSertifikat?: {
    url: string | null;
    filename: string | null;
    uploadedAt: string | null;
    uploadedBy: string | null;
  } | null;
}

export function SertifikatUpload({ 
  pendaftaranId, 
  currentSertifikat
}: SertifikatUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validasi file
      if (selectedFile.type !== 'application/pdf') {
        toast.error("File harus berformat PDF");
        return;
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error("Ukuran file tidak boleh lebih dari 10MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Silakan pilih file PDF terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadSertifikatHKI(pendaftaranId, file);
      
      if (result.success) {
        toast.success(result.message);
        setFile(null);
        // Reset input file
        const fileInput = document.getElementById('sertifikat-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengupload sertifikat");
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteSertifikatHKI(pendaftaranId);
      
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus sertifikat");
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (currentSertifikat?.url) {
      window.open(currentSertifikat.url, '_blank');
    }
  };

  return (
    <Card className="border-green-200/50 bg-gradient-to-br from-green-50/30 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <FileText className="h-5 w-5" />
          Sertifikat HKI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSertifikat?.url ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50/50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Sertifikat HKI telah diupload dan dapat diakses oleh pemohon.
              </AlertDescription>
            </Alert>

            <div className="bg-white/80 rounded-lg border border-green-200/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">
                    {currentSertifikat.filename || "Sertifikat HKI.pdf"}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  PDF
                </Badge>
              </div>

              {currentSertifikat.uploadedAt && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Diupload: {new Date(currentSertifikat.uploadedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className={`mr-2 h-4 w-4 ${deleting ? 'animate-spin' : ''}`} />
                  {deleting ? 'Menghapus...' : 'Hapus'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="border-amber-200 bg-amber-50/50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Belum ada sertifikat HKI yang diupload. Upload sertifikat setelah pendaftaran disetujui.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <label htmlFor="sertifikat-upload" className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Sertifikat HKI (PDF)
                </label>
                <Input
                  id="sertifikat-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="bg-white border-slate-200"
                  disabled={uploading}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: PDF, Maksimal: 10MB
                </p>
              </div>

              {file && (
                <div className="bg-blue-50/50 rounded-lg border border-blue-200/50 p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-800">{file.name}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Upload className={`mr-2 h-4 w-4 ${uploading ? 'animate-spin' : ''}`} />
                {uploading ? 'Mengupload...' : 'Upload Sertifikat'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
