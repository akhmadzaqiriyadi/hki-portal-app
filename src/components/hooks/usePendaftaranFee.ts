// src/components/hooks/usePendaftaranFee.ts

import { useState, useEffect } from 'react';

// Konfigurasi biaya pendaftaran terpusat di sini
const BiayaPendaftaranConfig = {
  "Civitas Akademik UTY": {
    SOFTWARE: 350000,
    NON_SOFTWARE: 250000,
  },
  Umum: {
    SOFTWARE: 700000,
    NON_SOFTWARE: 500000,
  },
};

/**
 * Custom hook untuk menghitung biaya pendaftaran secara dinamis.
 * @param jenisPemilik - Status pemilik hak cipta ('Civitas Akademik UTY' atau 'Umum').
 * @param jenisKarya - Kode jenis karya yang dipilih dari form.
 * @returns {number} Nominal biaya pendaftaran yang telah dihitung.
 */
export function usePendaftaranFee(jenisPemilik?: string, jenisKarya?: string): number {
  const [biaya, setBiaya] = useState(0);

  useEffect(() => {
    // Hanya hitung jika kedua parameter ada nilainya
    if (jenisPemilik && jenisKarya) {
      // Tentukan apakah karya termasuk kategori SOFTWARE atau NON_SOFTWARE
      // Berdasarkan skema, "KARYA_LAINNYA" dianggap sebagai software.
      const tipeKarya = jenisKarya === "KARYA_LAINNYA" ? "SOFTWARE" : "NON_SOFTWARE";
      
      // Ambil biaya dari objek konfigurasi
      const calculatedBiaya = BiayaPendaftaranConfig[jenisPemilik as keyof typeof BiayaPendaftaranConfig]?.[tipeKarya] || 0;
      
      setBiaya(calculatedBiaya);
    } else {
      // Jika salah satu parameter tidak ada, reset biaya menjadi 0
      setBiaya(0);
    }
  }, [jenisPemilik, jenisKarya]); // Jalankan efek ini setiap kali nilai parameter berubah

  return biaya;
}