"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadPendaftaranPDF } from "@/lib/pdf-generator";
import type { PendaftaranWithPemohon, Pencipta } from "@/lib/types";
import { toast } from "sonner";

interface PendaftaranWithPencipta extends PendaftaranWithPemohon {
  pencipta: Pencipta[];
}

// Flexible type for PDF generation
type FlexiblePendaftaran = PendaftaranWithPencipta | (PendaftaranWithPemohon & { 
  pencipta?: Pencipta[];
  judul_karya?: string;
  pemohon?: { nama: string; email: string };
});

interface DownloadPDFButtonProps {
  pendaftaran: FlexiblePendaftaran;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DownloadPDFButton({ 
  pendaftaran, 
  variant = "outline", 
  size = "sm",
  className = ""
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Show loading toast
      toast.loading("Mempersiapkan file PDF...", {
        id: "pdf-generation"
      });
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate and download PDF
      const dataForPDF = {
        ...pendaftaran,
        // Ensure compatibility between different data structures
        judul_karya: (pendaftaran as any).judul_karya || pendaftaran.judul,
        pemohon: (pendaftaran as any).pemohon || (pendaftaran.users ? {
          nama: pendaftaran.users.nama_lengkap || '',
          email: pendaftaran.users.email || ''
        } : { nama: '', email: '' }),
        pencipta: (pendaftaran as any).pencipta || []
      };
      downloadPendaftaranPDF(dataForPDF as any);
      
      // Success toast
      toast.success("PDF berhasil diunduh!", {
        id: "pdf-generation",
        description: `File: Pendaftaran_HKI_${(pendaftaran.judul || (pendaftaran as any).judul_karya || 'Unknown').slice(0, 30)}...pdf`
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat PDF", {
        id: "pdf-generation",
        description: "Terjadi kesalahan saat membuat file PDF. Silakan coba lagi."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={`${className} ${isGenerating ? 'cursor-not-allowed' : ''}`}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? "Membuat PDF..." : "Download PDF"}
    </Button>
  );
}

interface QuickDownloadButtonProps {
  pendaftaran: FlexiblePendaftaran;
  className?: string;
}

export function QuickDownloadButton({ 
  pendaftaran,
  className = ""
}: QuickDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate and download PDF
      const dataForPDF = {
        ...pendaftaran,
        judul_karya: (pendaftaran as any).judul_karya || pendaftaran.judul,
        pemohon: (pendaftaran as any).pemohon || (pendaftaran.users ? {
          nama: pendaftaran.users.nama_lengkap || '',
          email: pendaftaran.users.email || ''
        } : { nama: '', email: '' }),
        pencipta: (pendaftaran as any).pencipta || []
      };
      downloadPendaftaranPDF(dataForPDF as any);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant="ghost"
      size="icon"
      className={`${className} hover:bg-blue-50 hover:text-blue-700`}
      title="Download PDF"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </Button>
  );
}
