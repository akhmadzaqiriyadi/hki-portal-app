# Fitur Upload dan Download Sertifikat HKI

## Overview
Fitur ini memungkinkan admin untuk mengupload sertifikat HKI setelah pendaftaran disetujui, dan memungkinkan user untuk melihat dan mendownload sertifikat mereka.

## Database Changes

### Kolom Baru di Tabel `pendaftaran`
- `sertifikat_hki_url`: URL file sertifikat HKI (TEXT)
- `sertifikat_hki_filename`: Nama file asli sertifikat (TEXT)
- `sertifikat_uploaded_at`: Timestamp upload sertifikat (TIMESTAMPTZ)
- `sertifikat_uploaded_by`: ID admin yang mengupload (UUID, foreign key ke auth.users)

### SQL Migration
1. **Jalankan script SQL di file `database_migration.sql` di Supabase SQL Editor**
2. **Setup Storage Policies menggunakan file `SETUP_STORAGE_SERTIFIKAT.md`**
3. **Verifikasi setup dengan file `testing_sertifikat.sql`**

### Manual Setup yang Diperlukan:

#### 1. Database Schema:
```bash
# Buka Supabase Dashboard → SQL Editor
# Copy-paste isi file database_migration.sql
# Klik RUN untuk menjalankan migration
```

#### 2. Storage Bucket Setup:
```bash
# Buka Supabase Dashboard → Storage → Buckets  
# Pastikan bucket 'dokumen-hki' sudah ada
# Jika belum ada, buat bucket baru dengan:
# - Name: dokumen-hki
# - Public: Yes
# - File size limit: 10MB
# - Allowed MIME types: application/pdf, image/jpeg, image/png
```

#### 3. Storage Policies:
```bash
# Buka Supabase Dashboard → SQL Editor
# Copy-paste policies dari SETUP_STORAGE_SERTIFIKAT.md
# Jalankan satu per satu untuk setup akses kontrol
```

## Komponen Baru

### 1. SertifikatUpload (Admin)
- **Path**: `src/components/features/admin/SertifikatUpload.tsx`
- **Purpose**: Interface untuk admin mengupload sertifikat HKI
- **Features**:
  - Upload file PDF (max 10MB)
  - Preview dan download sertifikat yang sudah ada
  - Hapus dan ganti sertifikat
  - Validasi file format dan ukuran

### 2. SertifikatView (User)
- **Path**: `src/components/features/pendaftaran/SertifikatView.tsx`  
- **Purpose**: Interface untuk user melihat dan mendownload sertifikat
- **Features**:
  - Status indikator berdasarkan status pendaftaran
  - Download sertifikat yang tersedia
  - Informasi tanggal penerbitan

## Server Actions

### uploadSertifikatHKI
- Upload file sertifikat ke Supabase Storage
- Update database dengan informasi sertifikat
- Validasi admin privileges
- Validasi status pendaftaran (harus approved)

### deleteSertifikatHKI
- Hapus file dari storage
- Clear informasi sertifikat dari database
- Validasi admin privileges

## Alur Kerja (Workflow)

### Admin Side:
1. Admin approve pendaftaran
2. Komponen SertifikatUpload muncul di halaman detail admin
3. Admin upload file PDF sertifikat
4. Sistem simpan file ke storage dan update database
5. Badge "Sertifikat" muncul di tabel list pendaftaran

### User Side:
1. User lihat status "approved" di dashboard
2. Komponen SertifikatView menampilkan status
3. Setelah admin upload, user bisa download sertifikat
4. Sertifikat tetap accessible sepanjang waktu

## File Terintegrasi

### Admin Pages:
- `/src/app/admin/pendaftaran/page.tsx` - List dengan badge sertifikat
- `/src/app/admin/pendaftaran/[id]/page.tsx` - Detail dengan upload form

### User Pages:
- `/src/app/(dashboard)/dashboard/pendaftaran/[id]/page.tsx` - Detail dengan view sertifikat

### Actions:
- `/src/lib/supabase/actions.ts` - Server actions baru

### Types:
- `/src/lib/types.ts` - Extended Pendaftaran interface

## Storage Setup

### Bucket: `dokumen-hki` (sama dengan dokumen pendaftaran lainnya)
- Path pattern: `sertifikat-hki/{pendaftaran-id}/{filename}`
- Public access untuk download
- File type: PDF only
- Max size: 10MB
- Konsisten dengan bucket yang sudah ada untuk dokumen lainnya

## Security

### RLS Policies:
- Admin dapat update sertifikat pada pendaftaran apa saja
- User hanya dapat melihat sertifikat pendaftaran mereka sendiri
- Admin dapat melihat semua sertifikat

### Validations:
- File harus PDF
- Maksimal 10MB
- Hanya admin yang dapat upload
- Pendaftaran harus status "approved"

## Usage Examples

### Admin Upload:
```typescript
const result = await uploadSertifikatHKI(pendaftaranId, file);
if (result.success) {
  toast.success("Sertifikat berhasil diupload");
}
```

### Admin Delete:
```typescript
const result = await deleteSertifikatHKI(pendaftaranId);
if (result.success) {
  toast.success("Sertifikat berhasil dihapus");
}
```

## Testing Checklist

### Admin:
- [ ] Upload sertifikat pada pendaftaran approved
- [ ] Tidak dapat upload pada pendaftaran non-approved
- [ ] File validation (PDF only, max 10MB)
- [ ] Preview dan download sertifikat
- [ ] Hapus sertifikat
- [ ] Ganti sertifikat
- [ ] Badge sertifikat muncul di list

### User:
- [ ] Lihat status "pending" untuk non-approved
- [ ] Lihat status "processing" untuk approved tanpa sertifikat
- [ ] Download sertifikat yang tersedia
- [ ] Informasi tanggal penerbitan

### General:
- [ ] Error handling untuk file gagal upload
- [ ] Error handling untuk network issues
- [ ] Responsive design pada mobile
- [ ] Loading states
- [ ] Success/error notifications
