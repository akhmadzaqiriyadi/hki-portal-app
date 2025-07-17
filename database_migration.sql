-- Migration untuk menambahkan kolom sertifikat HKI
-- Jalankan script SQL ini di Supabase SQL Editor

-- ===================================
-- 1. MENAMBAHKAN KOLOM SERTIFIKAT HKI
-- ===================================

-- Menambahkan kolom untuk menyimpan URL file sertifikat HKI
ALTER TABLE public.pendaftaran
ADD COLUMN IF NOT EXISTS sertifikat_hki_url TEXT;

-- Menambahkan kolom untuk menyimpan nama file sertifikat
ALTER TABLE public.pendaftaran
ADD COLUMN IF NOT EXISTS sertifikat_hki_filename TEXT;

-- Menambahkan kolom untuk menyimpan tanggal upload sertifikat
ALTER TABLE public.pendaftaran
ADD COLUMN IF NOT EXISTS sertifikat_uploaded_at TIMESTAMPTZ;

-- Menambahkan kolom untuk menyimpan ID admin yang mengupload sertifikat
ALTER TABLE public.pendaftaran
ADD COLUMN IF NOT EXISTS sertifikat_uploaded_by UUID REFERENCES auth.users(id);

-- ===================================
-- 2. KOMENTAR KOLOM
-- ===================================

-- Memberi komentar pada kolom baru agar jelas fungsinya
COMMENT ON COLUMN public.pendaftaran.sertifikat_hki_url IS 'URL file sertifikat HKI yang diupload oleh admin setelah pendaftaran disetujui';
COMMENT ON COLUMN public.pendaftaran.sertifikat_hki_filename IS 'Nama file asli dari sertifikat HKI';
COMMENT ON COLUMN public.pendaftaran.sertifikat_uploaded_at IS 'Tanggal dan waktu ketika sertifikat diupload';
COMMENT ON COLUMN public.pendaftaran.sertifikat_uploaded_by IS 'ID admin yang mengupload sertifikat';

-- ===================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ===================================

-- Policy untuk admin dapat mengupdate sertifikat HKI pada pendaftaran apa saja
CREATE POLICY "Admin can update sertifikat HKI" ON public.pendaftaran
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- Policy untuk user dapat melihat sertifikat mereka sendiri
CREATE POLICY "Users can view their own sertifikat" ON public.pendaftaran
    FOR SELECT USING (
        user_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'Admin'
        )
    );

-- ===================================
-- 4. VERIFIKASI PERUBAHAN
-- ===================================

-- Query untuk memeriksa apakah kolom berhasil ditambahkan
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pendaftaran' 
AND column_name LIKE 'sertifikat%'
ORDER BY column_name;
