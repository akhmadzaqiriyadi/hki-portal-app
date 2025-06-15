"use client";

import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadCloud, FileText, X, Loader2, Eye } from 'lucide-react';
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
    <div className="space-y-4">
      {fileUrl ? (
        // Tampilan Preview setelah upload berhasil
        <div className="space-y-3">
          {/* Indikator sukses */}
          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✅ File berhasil diunggah dan tersimpan!
              </AlertDescription>
            </Alert>
          )}
          
          {/* Preview Area */}
          <div className="relative group w-full border-2 border-green-200 rounded-lg overflow-hidden bg-white">
            {isImage ? (
              <div className="relative w-full h-48">
                <Image 
                  src={fileUrl} 
                  alt="Preview gambar yang diunggah" 
                  fill
                  className="object-contain p-2" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(fileUrl, '_blank')}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <FileText className="mx-auto h-16 w-16 text-blue-500 mb-3" />
                <p className="font-medium text-gray-900 mb-1">
                  {getFileName(fileUrl)}
                </p>
                <p className="text-sm text-gray-500 mb-4">File berhasil diunggah</p>
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(fileUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat File
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Tampilan Dropzone Upload
        <div className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-primary hover:bg-gray-50 transition-all duration-200">
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Mengunggah file...</p>
              <p className="text-xs text-muted-foreground mt-1">Mohon tunggu sebentar</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Seret & lepas file di sini
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                atau klik untuk memilih file
              </p>
              <p className="text-xs text-muted-foreground">
                Maksimal {(maxSize / (1024 * 1024)).toFixed(1)}MB
              </p>
              <Input 
                id={field.name} 
                type="file" 
                accept={accept}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </>
          )}
        </div>
      )}
      
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}