"use client";

import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadCloud, FileText, X, Loader2, Eye, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Komponen ini akan menerima 'field' dari react-hook-form Controller/FormField
interface FileUploadProps {
  field: ControllerRenderProps<any, any>;
  accept?: string; // Tambahan untuk membatasi jenis file
  maxSize?: number; // Tambahan untuk membatasi ukuran file (dalam bytes)
}

export function FileUpload({ field, accept, maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi ukuran file
    if (file.size > maxSize) {
      setError(`Ukuran file terlalu besar. Maksimal ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const supabase = createClient();
      
      // Membuat nama file yang unik untuk menghindari tumpang tindih
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dokumen-hki') // Pastikan nama bucket ini sesuai dengan di Supabase
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dokumen-hki')
        .getPublicUrl(filePath);

      // Memperbarui state react-hook-form dengan URL yang didapat
      field.onChange(publicUrl);
      setUploadSuccess(true);
      
      // Reset input file untuk memungkinkan upload file yang sama lagi
      event.target.value = '';
      
    } catch (err) {
      setError(`Gagal mengunggah: ${err instanceof Error ? err.message : 'Terjadi kesalahan'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    field.onChange(undefined);
    setUploadSuccess(false);
    setError(null);
  };

  const fileUrl = field.value;
  const isImage = typeof fileUrl === 'string' && 
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileUrl);
  
  const getFileName = (url: string) => {
    try {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      // Menghapus timestamp dari nama file untuk tampilan yang lebih bersih
      return fileName.replace(/^\d+_/, '');
    } catch {
      return 'File';
    }
  };

  return (
    <div className="w-full space-y-3">
      {fileUrl ? (
        // Tampilan Preview setelah upload berhasil
        <div className="w-full space-y-3">
          {/* Indikator sukses */}
          {uploadSuccess && (
            <Alert className="border-green-300/50 bg-gradient-to-r from-green-50 to-green-100/50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium text-sm">
                File berhasil diunggah dan tersimpan!
              </AlertDescription>
            </Alert>
          )}
          
          {/* Preview Area */}
          <div className="w-full border-2 border-green-200/50 rounded-xl overflow-hidden bg-gradient-to-br from-white to-green-50/30 shadow-md">
            {isImage ? (
              <div className="relative w-full h-48">
                <Image 
                  src={fileUrl} 
                  alt="Preview gambar yang diunggah" 
                  fill
                  className="object-contain p-3" 
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(fileUrl, '_blank')}
                    className="h-8 px-2 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline text-xs">Lihat</span>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 px-2 shadow-lg backdrop-blur-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline text-xs">Hapus</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full p-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-slate-800 mb-1 text-sm break-all px-2">
                    {getFileName(fileUrl)}
                  </p>
                  <p className="text-xs text-slate-600 mb-4">
                    File berhasil diunggah
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(fileUrl, '_blank')}
                      className="flex-1 border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="text-xs">Lihat File</span>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="flex-1 bg-red-500 hover:bg-red-600 transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      <span className="text-xs">Hapus</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Tampilan Dropzone Upload
        <div className="relative w-full">
          <div className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center p-4 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/30 hover:to-blue-100/20 transition-all duration-300 cursor-pointer">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Mengunggah file...
                </p>
                <p className="text-xs text-slate-500">
                  Mohon tunggu sebentar
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-3 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UploadCloud className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  Seret & lepas file di sini
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  atau klik untuk memilih file
                </p>
                <div className="px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">
                    Maks {(maxSize / (1024 * 1024)).toFixed(1)}MB
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Hidden file input */}
          <Input 
            id={field.name} 
            type="file" 
            accept={accept}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-300/50 bg-gradient-to-r from-red-50 to-red-100/50">
          <X className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}