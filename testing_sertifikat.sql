-- Testing Script untuk Fitur Sertifikat HKI
-- Jalankan query ini untuk testing dan verifikasi setup

-- ===================================
-- 1. VERIFIKASI STRUKTUR TABEL
-- ===================================

-- Cek apakah kolom sertifikat sudah ditambahkan
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'pendaftaran' 
AND column_name LIKE '%sertifikat%'
ORDER BY ordinal_position;

-- ===================================
-- 2. VERIFIKASI RLS POLICIES
-- ===================================

-- Cek policies untuk tabel pendaftaran
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'pendaftaran'
AND policyname LIKE '%sertifikat%';

-- ===================================
-- 3. VERIFIKASI STORAGE BUCKET
-- ===================================

-- Cek konfigurasi bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at,
    updated_at
FROM storage.buckets 
WHERE id = 'dokumen-hki';

-- ===================================
-- 4. VERIFIKASI STORAGE POLICIES
-- ===================================

-- Cek policies untuk storage objects
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%sertifikat%';

-- ===================================
-- 5. TESTING DATA
-- ===================================

-- Lihat data pendaftaran dengan status approved (untuk testing upload)
SELECT 
    id,
    judul,
    status,
    user_id,
    sertifikat_hki_url,
    sertifikat_hki_filename,
    sertifikat_uploaded_at,
    sertifikat_uploaded_by,
    created_at
FROM public.pendaftaran 
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 5;

-- ===================================
-- 6. SIMULASI UPDATE SERTIFIKAT
-- ===================================

-- JANGAN JALANKAN ini di production, hanya untuk testing!
-- Simulasi update sertifikat (ganti {pendaftaran-id} dengan ID yang valid)
/*
UPDATE public.pendaftaran 
SET 
    sertifikat_hki_url = 'https://example.com/test-sertifikat.pdf',
    sertifikat_hki_filename = 'test-sertifikat.pdf',
    sertifikat_uploaded_at = NOW(),
    sertifikat_uploaded_by = auth.uid()
WHERE id = '{pendaftaran-id}' 
AND status = 'approved';
*/

-- ===================================
-- 7. QUERY UNTUK MONITORING
-- ===================================

-- Monitor sertifikat yang sudah diupload
SELECT 
    p.id,
    p.judul,
    p.status,
    u.nama_lengkap as pemohon,
    p.sertifikat_hki_filename,
    p.sertifikat_uploaded_at,
    admin.nama_lengkap as uploaded_by_admin
FROM public.pendaftaran p
LEFT JOIN public.users u ON p.user_id = u.id
LEFT JOIN public.users admin ON p.sertifikat_uploaded_by = admin.id
WHERE p.sertifikat_hki_url IS NOT NULL
ORDER BY p.sertifikat_uploaded_at DESC;

-- Statistik sertifikat
SELECT 
    COUNT(*) as total_approved,
    COUNT(sertifikat_hki_url) as total_dengan_sertifikat,
    COUNT(*) - COUNT(sertifikat_hki_url) as total_tanpa_sertifikat,
    ROUND(
        (COUNT(sertifikat_hki_url)::float / COUNT(*)::float) * 100, 2
    ) as persentase_sertifikat
FROM public.pendaftaran 
WHERE status = 'approved';

-- ===================================
-- 8. CLEANUP TESTING DATA (HATI-HATI!)
-- ===================================

-- JANGAN JALANKAN di production!
-- Query untuk menghapus data testing sertifikat
/*
UPDATE public.pendaftaran 
SET 
    sertifikat_hki_url = NULL,
    sertifikat_hki_filename = NULL,
    sertifikat_uploaded_at = NULL,
    sertifikat_uploaded_by = NULL
WHERE sertifikat_hki_filename = 'test-sertifikat.pdf';
*/
