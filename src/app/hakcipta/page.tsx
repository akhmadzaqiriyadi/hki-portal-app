"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Book,
  Music,
  Camera,
  Video,
  Palette,
  Code,
  Globe,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/landingpage/HeaderComponent";
import { useRouter } from "next/navigation";
import Footer from "@/components/landingpage/FooterComponent";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const HakCiptaPage = () => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activePdfPath, setActivePdfPath] = useState<string | null>(null);
  const [isObjectSectionVisible, setIsObjectSectionVisible] = useState(true);
  const router = useRouter();
  
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfWidth, setPdfWidth] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    const container = pdfContainerRef.current;
    
    if (showPdfViewer && container) {
      const observer = new ResizeObserver(() => {
        setPdfWidth(container.clientWidth);
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [showPdfViewer]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const copyrightCategories = {
    KARYA_TULIS: {
      icon: Book,
      color: "bg-red-500",
      label: "KARYA TULIS",
      shortLabel: "TULIS",
      subCategories: [
        "Atlas",
        "Biografi",
        "Booklet",
        "Buku",
        "Buku Mewarnai",
        "Buku Panduan/Petunjuk",
        "Buku Pelajaran",
        "Buku Saku",
        "Bunga Rampai",
        "Cerita Bergambar",
      ],
    },
    KARYA_SENI: {
      icon: Palette,
      color: "bg-blue-500",
      label: "KARYA SENI",
      shortLabel: "SENI",
      subCategories: [
        "Diktat",
        "Dongeng",
        "e-Book",
        "Ensiklopedia",
        "Jurnal",
        "Kamus",
        "Karya Ilmiah",
        "Karya Tulis",
        "Karya Tulis (Artikel)",
        "Karya Tulis (Disertasi)",
      ],
    },
    KOMPOSISI_MUSIK: {
      icon: Music,
      color: "bg-purple-500",
      label: "KOMPOSISI MUSIK",
      shortLabel: "MUSIK",
      subCategories: [
        "Karya Tulis (Skripsi)",
        "Karya Tulis (Tesis)",
        "Karya Tulis Lainnya",
        "Komik",
        "Laporan Penelitian",
        "Majalah",
        "Makalah",
        "Modul",
      ],
    },
    KARYA_AUDIO_VISUAL: {
      icon: Video,
      color: "bg-green-500",
      label: "KARYA AUDIO VISUAL",
      shortLabel: "A/V",
      subCategories: [
        "Naskah Drama/Pertunjukan",
        "Naskah Film",
        "Naskah Karya Siaran",
        "Naskah Karya Sinematografi",
        "Novel",
        "Perwajahan Karya Tulis",
        "Proposal Penelitian",
        "Puisi",
      ],
    },
    KARYA_FOTOGRAFI: {
      icon: Camera,
      color: "bg-yellow-500",
      label: "KARYA FOTOGRAFI",
      shortLabel: "FOTO",
      subCategories: ["Resensi", "Resume/Ringkasan", "Saduran", "Sinopsis"],
    },
    KARYA_DRAMA: {
      icon: Globe,
      color: "bg-indigo-500",
      label: "KARYA DRAMA & KOREOGRAFI", // Sedikit diringkas dengan '&'
      shortLabel: "DRAMA",
      subCategories: [],
    },
    KARYA_REKAMAN: {
      icon: FileText,
      color: "bg-pink-500",
      label: "KARYA REKAMAN",
      shortLabel: "REKAM",
      subCategories: [],
    },
    KARYA_LAINNYA: {
      icon: Code,
      color: "bg-orange-500",
      label: "KARYA LAINNYA",
      shortLabel: "LAIN",
      subCategories: [
        "Tafsir",
        "Terjemahan",
        "Basis Data",
        "Kompilasi Ciptaan/Data",
        "Permainan Video",
        "Program Komputer",
      ],
    },
  };

  const adminSteps = [
    {
      title: "Kartu Tanda Penduduk",
      description:
        "Kami persiapkan untuk memberikan watermark pada KTP melalui tautan watermarkktp.com. Himpun dalam satu file PDF.",
      hasDownload: false,
    },
    {
      title: "Formulir pencatatan unduh",
      description:
        "Isikan data pada formulir, hingga benar-benar valid. copy-paste data pada formulir ini ke field surat pernyataan dan surat pengalihan. Save dan kirim dengan format word (doc).",
      hasDownload: true,
      downloadText: "contoh | unduh",
    },
    {
      title: "Surat pernyataan pencatatan hak cipta",
      description:
        "Copy-paste data valid dari formulir. Bubuhkan meterai 10.000 di kolom tanda tangan Kepala Sentra HKI. Scan dan kirim dengan format PDF.",
      hasDownload: true,
      downloadText: "contoh | unduh",
    },
    {
      title: "Surat pengalihan pencatatan hak cipta",
      description:
        "Copy-paste data valid dari formulir. Tanda tangan Kepala Sentra HKI dikosongkan. Tanda tangan surat tidak dapat diwakilkan oleh satu orang. Scan dan kirim dengan format PDF.",
      hasDownload: true,
      downloadText: "contoh | unduh",
    },
    {
      title: "Lampirkan karya ciptaan yang dapat dicatatkan",
      description:
        "Cermat daftar di bawah untuk melihat jenis soft file yang dapat dicatatkan/dilampirkan:",
      hasDownload: false,
      hasPdfViewer: true,
    },
  ];

  const feeStructure = [
    {
      category: "Lembaga Pendidikan",
      nonSoftware: "Rp. 250.000",
      software: "Rp. 350.000",
      unit: "Per Permohonan",
    },
    {
      category: "Umum",
      nonSoftware: "Rp. 500.000",
      software: "Rp. 700.000",
      unit: "Per Permohonan",
    },
  ];

  const handlePdfView = (pdfName: string) => {
    setActivePdfPath(`/hakcipta/${pdfName}.pdf`);
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    setActivePdfPath(null);
    setNumPages(null);
  };

  const toggleObjectSection = () => {
    setIsObjectSectionVisible(!isObjectSectionVisible);
  };

  return (
    <>
      <Header onLogin={handleLogin} onRegister={handleRegister} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-800" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Pendaftaran Hak Cipta
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                  Berikut dijabarkan tahapan dan berkas administrasi untuk
                  pencatatan hak cipta.
                </p>
              </div>
            </div>
          </div>

          {/* Section A: Objek Perlindungan */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-8">
            <div className="p-4 sm:p-8 pb-3 sm:pb-4">
              <div className="flex items-center justify-between gap-3">
                {/* [RESPONSIVE FIX] Bagian Judul Seksi */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                    A
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
                    MENENTUKAN OBJEK PERLINDUNGAN HAK CIPTA
                  </h3>
                </div>
                <button
                  onClick={toggleObjectSection}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    {isObjectSectionVisible ? "Sembunyikan" : "Tampilkan"}
                  </span>
                  {isObjectSectionVisible ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {isObjectSectionVisible && (
              <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                  Penentuan objek jenis ciptaan dapat mempermudah pencipta dalam
                  pengisian dokumen pengajuan. Pilih objek jenis karya lalu
                  sesuaikan dengan subjenjisnya. Dilarang memberi nama sendiri.
                  Cermat daftar di bawah untuk melihat objek jenis dan subjenis
                  ciptaan yang dapat dilindungi.
                </p>
                <Tabs defaultValue="KARYA_TULIS" className="w-full">
                  {/* [RESPONSIVE FIX] Bagian TABS */}
                  <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-slate-100 gap-1">
                    {Object.entries(copyrightCategories).map(([key, data]) => {
                      const IconComponent = data.icon;
                      return (
                        <TabsTrigger
                          key={key}
                          value={key}
                          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="text-center leading-tight hidden md:inline">
                            {data.label}
                          </span>
                          <span className="text-center leading-tight md:hidden">
                            {data.shortLabel}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {Object.entries(copyrightCategories).map(([key, data]) => (
                    <TabsContent key={key} value={key} className="mt-4 sm:mt-6">
                      <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${data.color} rounded-lg flex items-center justify-center`}
                          >
                            <data.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                            {data.label} - Sub Jenis
                          </h4>
                        </div>
                        {data.subCategories.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {data.subCategories.map((subCategory, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-2 sm:p-3 border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                              >
                                <span className="text-slate-700 text-xs sm:text-sm font-medium">
                                  {index + 1}. {subCategory}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">
                            <p className="text-slate-500 italic text-center text-sm sm:text-base">
                              Tidak ada sub kategori untuk kategori ini.
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-500">
                    sumber: e-hakcipta.dgip.go.id
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Berkas Administrasi */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
             {/* [RESPONSIVE FIX] Bagian Judul Seksi */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                B
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                BERKAS ADMINISTRASI
              </h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {adminSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-200 pl-4 sm:pl-6 pb-4 sm:pb-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
                        {index + 1}. {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {step.description}
                      </p>
                      {step.hasDownload && (
                        <div className="flex items-center gap-4">
                          <button className="text-blue-600 hover:text-blue-800 underline text-xs sm:text-sm">
                            {step.downloadText}
                          </button>
                        </div>
                      )}
                      {step.hasPdfViewer && (
                        <div className="mt-4">
                          <button
                            onClick={() => handlePdfView("copyright-works")}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              Lihat Daftar Karya Ciptaan
                            </span>
                            <span className="sm:hidden">Lihat Daftar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-amber-800">
                    <strong>Penting:</strong> Pastikan data pada formulir sama
                    persis dengan data pada surat pernyataan dan pengalihan.
                    Kesalahan data akan berpengaruh pada sertifikat. Kirim semua
                    berkas administrasi ke alamat email
                    <strong> hki@uty.ac.id</strong> dengan subjek email "
                    <strong>Hak Cipta - Nama Luaran</strong>". Hubungi{" "}
                    <strong>081572421910</strong> jika belum mendapat balasan
                    email dalam waktu 2×24 jam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Biaya Pencatatan */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
             {/* [RESPONSIVE FIX] Bagian Judul Seksi */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-base">
                C
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                BIAYA PENCATATAN
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 leading-relaxed">
              Pelayanan bagi civitas akademika Universitas Ahmad Dahlan merupakan
              cukup tajam untuk kalangan dosen dan mahasiswa. Permohonan tersebut
              atas pelibagai kepentingan. Oleh karena itu, Sentra HKI perlu
              membuat peraturan yang dapat dipahami bersama.
            </p>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700">
                  Pengaturan Subsidi <strong>lihat</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700">
                  Ketersediaan Subsidi <strong>lihat</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700">
                  Template Surat rekomendasi Program Studi <strong>unduh</strong>
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900 text-xs sm:text-sm">
                      KATEGORI
                    </th>
                    <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900 text-xs sm:text-sm">
                      NON SOFTWARE
                    </th>
                    <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900 text-xs sm:text-sm">
                      SOFTWARE
                    </th>
                    <th className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-900 text-xs sm:text-sm">
                      SATUAN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((fee, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 font-medium text-slate-900 text-xs sm:text-sm">
                        {fee.category}
                      </td>
                      <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 text-xs sm:text-sm">
                        {fee.nonSoftware}
                      </td>
                      <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 text-xs sm:text-sm">
                        {fee.software}
                      </td>
                      <td className="border border-slate-300 px-2 sm:px-4 py-2 sm:py-3 text-slate-700 text-xs sm:text-sm">
                        {fee.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PDF Viewer Modal */}
        {showPdfViewer && activePdfPath && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-5/6 flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
                <h3 className="text-sm sm:text-xl font-bold text-slate-900 leading-tight">
                  Daftar Karya Ciptaan yang Dapat Dicatatkan
                </h3>
                <button
                  onClick={closePdfViewer}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div ref={pdfContainerRef} className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-100">
                <Document
                  file={activePdfPath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) =>
                    console.error("Error loading PDF:", error.message)
                  }
                  loading={
                    <div className="text-center text-slate-600">
                      Memuat PDF...
                    </div>
                  }
                  error={
                    <div className="text-center text-red-600">
                      Gagal memuat PDF. Pastikan file tersedia di path: {activePdfPath}
                    </div>
                  }
                >
                  {pdfWidth > 0 && Array.from(new Array(numPages || 0), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={pdfWidth}
                      className="mb-4 shadow-md"
                    />
                  ))}
                </Document>
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-200 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Total Halaman: {numPages || "..."}
                </p>
                <div className="flex justify-end gap-2 sm:gap-4">
                  <button
                    onClick={closePdfViewer}
                    className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
                  >
                    Tutup
                  </button>
                  <a
                    href={activePdfPath}
                    download
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default HakCiptaPage;