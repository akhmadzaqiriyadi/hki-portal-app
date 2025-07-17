// src/lib/pdf-generator.ts
import jsPDF from 'jspdf';
import type { PendaftaranWithPemohon, Pencipta } from '@/lib/types';

interface PendaftaranWithPencipta extends PendaftaranWithPemohon {
  pencipta: Pencipta[];
}

export const generatePendaftaranPDF = (pendaftaran: PendaftaranWithPencipta) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  let yPosition = 20;
  const lineHeight = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper function to add text with automatic line breaks
  const addText = (text: string, x: number, y: number, maxWidth?: number) => {
    if (maxWidth) {
      const splitText = doc.splitTextToSize(text, maxWidth);
      doc.text(splitText, x, y);
      return y + (splitText.length * lineHeight);
    } else {
      doc.text(text, x, y);
      return y + lineHeight;
    }
  };
  
  // Helper function to check page break
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('DETAIL PENDAFTARAN HAK CIPTA', margin, yPosition);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Portal HKI - Universitas Teknologi Yogyakarta`, margin, yPosition + 5);
  
  // Line separator
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5);
  yPosition += 15;
  
  // Status Badge
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const statusText = `STATUS: ${pendaftaran.status.toUpperCase()}`;
  const statusWidth = doc.getTextWidth(statusText) + 10;
  
  // Set color based on status
  switch (pendaftaran.status) {
    case 'approved':
      doc.setFillColor(34, 197, 94); // green
      break;
    case 'submitted':
      doc.setFillColor(251, 191, 36); // amber
      break;
    case 'revisi':
      doc.setFillColor(239, 68, 68); // red
      break;
    default:
      doc.setFillColor(148, 163, 184); // gray
  }
  
  doc.roundedRect(margin, yPosition, statusWidth, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, margin + 5, yPosition + 6);
  doc.setTextColor(0, 0, 0);
  yPosition += 20;
  
  // Informasi Pendaftaran
  checkPageBreak(80);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('INFORMASI PENDAFTARAN', margin, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const infoData = [
    ['ID Pendaftaran', pendaftaran.id],
    ['Judul Karya', pendaftaran.judul],
    ['Produk Hasil', pendaftaran.produk_hasil || '-'],
    ['Jenis Karya', pendaftaran.jenis_karya || '-'],
    ['Sub Jenis Karya', pendaftaran.sub_jenis_karya || '-'],
    ['Nilai Aset Karya', pendaftaran.nilai_aset_karya ? `Rp ${pendaftaran.nilai_aset_karya.toLocaleString('id-ID')}` : '-'],
    ['Tanggal Diumumkan', pendaftaran.tanggal_diumumkan ? new Date(pendaftaran.tanggal_diumumkan).toLocaleDateString('id-ID') : '-'],
    ['Kota Diumumkan', pendaftaran.kota_diumumkan || '-'],
    ['Tanggal Pendaftaran', new Date(pendaftaran.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })],
  ];
  
  infoData.forEach(([label, value]) => {
    checkPageBreak(15);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(value || '-', margin + 50, yPosition - lineHeight, contentWidth - 50);
    yPosition += 3;
  });
  
  // Deskripsi Karya
  if (pendaftaran.deskripsi_karya) {
    checkPageBreak(30);
    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Deskripsi Karya:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(pendaftaran.deskripsi_karya, margin, yPosition + 3, contentWidth);
  }
  
  // Informasi Pemohon
  checkPageBreak(50);
  yPosition += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('INFORMASI PEMOHON', margin, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const pemohonData = [
    ['Nama Lengkap', pendaftaran.users?.nama_lengkap || '-'],
    ['Email', pendaftaran.users?.email || '-'],
  ];
  
  pemohonData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(value, margin + 50, yPosition - lineHeight);
    yPosition += 3;
  });
  
  // Data Pencipta
  if (pendaftaran.pencipta && pendaftaran.pencipta.length > 0) {
    pendaftaran.pencipta.forEach((pencipta, index) => {
      checkPageBreak(100);
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`DATA PENCIPTA ${index + 1}`, margin, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const penciptaData = [
        ['Nama Lengkap', pencipta.nama_lengkap],
        ['NIK', pencipta.nik],
        ['NIP/NIM', pencipta.nip_nim],
        ['Email', pencipta.email],
        ['No. HP', pencipta.no_hp],
        ['Jenis Kelamin', pencipta.jenis_kelamin],
        ['Fakultas', pencipta.fakultas],
        ['Program Studi', pencipta.program_studi],
        ['Kewarganegaraan', pencipta.kewarganegaraan],
        ['Negara', pencipta.negara],
        ['Provinsi', pencipta.provinsi],
        ['Kota', pencipta.kota],
        ['Kecamatan', pencipta.kecamatan],
        ['Kelurahan', pencipta.kelurahan],
        ['Kode Pos', pencipta.kode_pos],
      ];
      
      penciptaData.forEach(([label, value]) => {
        if (value) {
          checkPageBreak(15);
          doc.setFont('helvetica', 'bold');
          yPosition = addText(`${label}:`, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          yPosition = addText(value, margin + 50, yPosition - lineHeight, contentWidth - 50);
          yPosition += 3;
        }
      });
      
      // Alamat Lengkap
      if (pencipta.alamat_lengkap) {
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        yPosition = addText('Alamat Lengkap:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        yPosition = addText(pencipta.alamat_lengkap, margin, yPosition + 3, contentWidth);
        yPosition += 5;
      }
    });
  }
  
  // File Lampiran
  checkPageBreak(60);
  yPosition += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('FILE LAMPIRAN', margin, yPosition);
  yPosition += 5;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const fileData = [
    ['Lampiran Karya', pendaftaran.lampiran_karya_url ? '✓ Tersedia' : '✗ Tidak tersedia'],
    ['Bukti Transfer', pendaftaran.bukti_transfer_url ? '✓ Tersedia' : '✗ Tidak tersedia'],
    ['Surat Pernyataan', pendaftaran.surat_pernyataan_url ? '✓ Tersedia' : '✗ Tidak tersedia'],
    ['Surat Pengalihan', pendaftaran.surat_pengalihan_url ? '✓ Tersedia' : '✗ Tidak tersedia'],
  ];
  
  fileData.forEach(([label, status]) => {
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`${label}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(status, margin + 50, yPosition - lineHeight);
    yPosition += 3;
  });
  
  // Catatan Revisi (jika ada)
  if (pendaftaran.status === 'revisi' && pendaftaran.catatan_revisi) {
    checkPageBreak(40);
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('CATATAN REVISI', margin, yPosition);
    yPosition += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(pendaftaran.catatan_revisi, margin, yPosition, contentWidth);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    // Footer text
    const footerText = `Portal HKI UTY - Digenerate pada ${new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    doc.text(footerText, margin, doc.internal.pageSize.getHeight() - 10);
    
    // Page number
    doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth - margin - 30, doc.internal.pageSize.getHeight() - 10);
  }
  
  return doc;
};

export const downloadPendaftaranPDF = (pendaftaran: PendaftaranWithPencipta) => {
  const doc = generatePendaftaranPDF(pendaftaran);
  const fileName = `Pendaftaran_HKI_${pendaftaran.judul.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
