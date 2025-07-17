# Checklist Deployment Fitur Sertifikat HKI

## Pre-Deployment Checklist

### ✅ Database Setup
- [ ] Jalankan migration script `database_migration.sql`
- [ ] Verifikasi kolom baru dengan query dari `testing_sertifikat.sql`
- [ ] Setup RLS policies untuk tabel pendaftaran
- [ ] Test database access dengan user role yang berbeda

### ✅ Storage Setup  
- [ ] Verifikasi bucket `dokumen-hki` sudah ada
- [ ] Setup storage policies untuk sertifikat folder
- [ ] Test upload permission untuk admin
- [ ] Test download permission untuk user
- [ ] Verifikasi file size limit (10MB)
- [ ] Test MIME type validation (PDF only untuk sertifikat)

### ✅ Code Review
- [ ] Review server actions: `uploadSertifikatHKI` dan `deleteSertifikatHKI`
- [ ] Review komponen admin: `SertifikatUpload.tsx`
- [ ] Review komponen user: `SertifikatView.tsx`
- [ ] Update interface TypeScript di `types.ts`
- [ ] Integration di halaman admin dan user

### ✅ Security Review
- [ ] Validasi hanya admin yang dapat upload
- [ ] User hanya dapat akses sertifikat mereka sendiri  
- [ ] File validation (type, size) berjalan dengan baik
- [ ] Error handling untuk unauthorized access
- [ ] Sanitization filename dan path

## Deployment Steps

### 1. Database Migration
```sql
-- Buka Supabase Dashboard → SQL Editor
-- Copy paste isi database_migration.sql
-- Execute migration
```

### 2. Storage Configuration
```sql
-- Setup storage policies
-- Copy paste dari SETUP_STORAGE_SERTIFIKAT.md
-- Execute semua policies
```

### 3. Application Deployment
```bash
# Deploy aplikasi dengan fitur baru
npm run build
# Deploy ke platform hosting Anda
```

### 4. Testing Post-Deployment

#### Admin Testing:
- [ ] Login sebagai admin
- [ ] Buka pendaftaran dengan status approved  
- [ ] Upload file PDF sertifikat (test various file sizes)
- [ ] Verifikasi preview dan download berfungsi
- [ ] Test hapus sertifikat
- [ ] Test ganti sertifikat
- [ ] Verifikasi badge sertifikat muncul di list
- [ ] Test error handling (file terlalu besar, bukan PDF, dll)

#### User Testing:
- [ ] Login sebagai user
- [ ] Cek pendaftaran yang belum approved (status pending)
- [ ] Cek pendaftaran approved tanpa sertifikat (status processing)
- [ ] Cek pendaftaran dengan sertifikat (download tersedia)
- [ ] Test download sertifikat
- [ ] Verifikasi informasi tanggal penerbitan
- [ ] Test responsive design di mobile

#### Security Testing:
- [ ] User tidak dapat upload sertifikat
- [ ] User tidak dapat akses sertifikat orang lain
- [ ] Anonymous user tidak dapat akses apapun
- [ ] File validation berjalan (reject non-PDF, file terlalu besar)
- [ ] SQL injection protection
- [ ] Path traversal protection

## Monitoring & Maintenance

### Performance Monitoring:
- [ ] Monitor storage usage
- [ ] Track upload/download speeds
- [ ] Monitor error rates
- [ ] Database query performance

### Regular Maintenance:
- [ ] Cleanup orphaned files di storage
- [ ] Monitor storage costs
- [ ] Review error logs
- [ ] Backup database secara berkala

### Analytics to Track:
- [ ] Jumlah sertifikat yang diupload per bulan
- [ ] Rata-rata waktu dari approved ke upload sertifikat
- [ ] Download rate sertifikat oleh user
- [ ] Error rate upload/download

## Rollback Plan

Jika terjadi masalah serius:

### 1. Disable Feature:
```typescript
// Temporary disable di komponen
const SERTIFIKAT_FEATURE_ENABLED = false;

// Wrap komponen dengan feature flag
{SERTIFIKAT_FEATURE_ENABLED && <SertifikatUpload />}
```

### 2. Database Rollback:
```sql
-- Jika perlu rollback kolom database
ALTER TABLE public.pendaftaran 
DROP COLUMN IF EXISTS sertifikat_hki_url,
DROP COLUMN IF EXISTS sertifikat_hki_filename,
DROP COLUMN IF EXISTS sertifikat_uploaded_at,  
DROP COLUMN IF EXISTS sertifikat_uploaded_by;
```

### 3. Storage Cleanup:
```sql
-- Hapus files sertifikat jika diperlukan
DELETE FROM storage.objects 
WHERE bucket_id = 'dokumen-hki' 
AND name LIKE 'sertifikat-hki/%';
```

## Success Criteria

Fitur dianggap berhasil jika:
- [ ] Admin dapat upload sertifikat tanpa error
- [ ] User dapat download sertifikat mereka
- [ ] Security validation berjalan dengan baik
- [ ] Performance tidak terpengaruh
- [ ] Error rate < 1%
- [ ] Load time < 3 detik untuk download
- [ ] Mobile compatibility 100%

## Contact & Support

Jika ada masalah:
1. Cek error logs di Supabase Dashboard
2. Review network requests di browser dev tools
3. Test dengan file PDF yang berbeda
4. Verifikasi user permissions
5. Cek storage quota dan limits
