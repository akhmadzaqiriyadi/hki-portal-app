# Setup Supabase Storage untuk Sertifikat HKI

## Langkah-langkah Setup Storage Bucket

### 1. Buka Supabase Dashboard
- Login ke dashboard Supabase Anda
- Pilih project HKI Portal App
- Navigasi ke Storage → Buckets

### 2. Verifikasi Bucket yang Ada
Pastikan bucket `dokumen-hki` sudah ada. Jika belum ada, buat bucket baru:

#### Membuat Bucket Baru (jika diperlukan):
```sql
-- Jalankan di SQL Editor jika bucket belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dokumen-hki',
  'dokumen-hki', 
  true,
  10485760,  -- 10MB dalam bytes
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
);
```

### 3. Setup Storage Policies untuk Sertifikat HKI

#### Policy untuk Upload (Admin Only):
```sql
-- Policy untuk admin mengupload sertifikat
CREATE POLICY "Admin can upload sertifikat files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'dokumen-hki' 
  AND (storage.foldername(name))[1] = 'sertifikat-hki'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'Admin'
  )
);
```

#### Policy untuk Update (Admin Only):
```sql
-- Policy untuk admin mengupdate/mengganti sertifikat
CREATE POLICY "Admin can update sertifikat files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'dokumen-hki' 
  AND (storage.foldername(name))[1] = 'sertifikat-hki'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'Admin'
  )
);
```

#### Policy untuk Delete (Admin Only):
```sql
-- Policy untuk admin menghapus sertifikat
CREATE POLICY "Admin can delete sertifikat files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'dokumen-hki' 
  AND (storage.foldername(name))[1] = 'sertifikat-hki'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'Admin'
  )
);
```

#### Policy untuk Download (User & Admin):
```sql
-- Policy untuk user melihat sertifikat mereka sendiri dan admin melihat semua
CREATE POLICY "Users can view their own sertifikat files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'dokumen-hki' 
  AND (storage.foldername(name))[1] = 'sertifikat-hki'
  AND (
    -- Admin dapat melihat semua sertifikat
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
    OR
    -- User hanya dapat melihat sertifikat mereka sendiri
    EXISTS (
      SELECT 1 FROM public.pendaftaran 
      WHERE pendaftaran.id = (storage.foldername(name))[2]::uuid
      AND pendaftaran.user_id = auth.uid()
    )
  )
);
```

### 4. Struktur Folder di Storage

File sertifikat akan disimpan dengan struktur:
```
dokumen-hki/
├── sertifikat-hki/
│   ├── {pendaftaran-id-1}/
│   │   └── sertifikat_judul_karya_timestamp.pdf
│   ├── {pendaftaran-id-2}/
│   │   └── sertifikat_judul_karya_timestamp.pdf
│   └── ...
├── lampiran-karya/
├── bukti-transfer/
└── ...
```

### 5. Verifikasi Setup

#### Cek Bucket Configuration:
```sql
-- Verifikasi bucket dan konfigurasinya
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'dokumen-hki';
```

#### Cek Storage Policies:
```sql
-- Verifikasi policies untuk storage objects
SELECT 
  policyname, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%sertifikat%';
```

### 6. Testing Setup

Setelah setup selesai, test dengan:

1. **Login sebagai Admin**
2. **Buka pendaftaran dengan status approved**
3. **Upload file PDF sertifikat**
4. **Verifikasi file tersimpan di Storage**
5. **Login sebagai User dan cek apakah bisa download**

### 7. Troubleshooting

#### Jika Upload Gagal:
- Cek apakah bucket `dokumen-hki` sudah ada
- Verifikasi policies untuk upload sudah aktif
- Pastikan user yang login adalah Admin
- Cek ukuran file tidak melebihi 10MB

#### Jika Download Gagal:
- Cek policies untuk SELECT/download
- Pastikan user memiliki akses ke pendaftaran tersebut
- Verifikasi file path di database sesuai dengan di storage

### 8. Security Checklist

- ✅ Hanya Admin yang dapat upload sertifikat
- ✅ User hanya dapat melihat sertifikat mereka sendiri
- ✅ File size limit 10MB
- ✅ Hanya file PDF yang diizinkan untuk sertifikat
- ✅ RLS policies aktif di tabel pendaftaran
- ✅ Storage policies aktif di bucket storage
