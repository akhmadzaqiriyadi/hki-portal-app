'use client';
import React from 'react';
import { ArrowRight, FileText, BarChart, ShieldCheck, CheckCircle, Users, Clock, Award, Menu, X, GraduationCap, Building } from "lucide-react";
import Image from 'next/image';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleRegister = () => {
    console.log("Navigate to register");
  };

  const handleLogin = () => {
    console.log("Navigate to login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with dark blue theme */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-white/90 border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-center gap-x-2">
          <Image src="/UTY.png" alt="Logo" width={42} height={42} />
          <Image src="/PrimaryLogo.png" alt="Logo" width={40} height={40} />
          <span className="ml-2 font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
             Portal UTY HKI
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-8">
          <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors">
            Fitur
          </a>
          <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors">
            Tentang
          </a>
          <button onClick={handleLogin} className="text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors">
            Masuk
          </button>
          <button 
            className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={handleRegister}
          >
            Daftar Sekarang
          </button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="ml-auto md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-800">Fitur</a>
              <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-blue-800">Tentang</a>
              <button onClick={handleLogin} className="text-sm font-medium text-slate-600 hover:text-blue-800 text-left">Masuk</button>
              <button onClick={handleRegister} className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-2 rounded-xl font-medium w-full">
                Daftar Sekarang
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-slate-800/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                {/* Trust badge */}
                <div className="flex items-center gap-2 text-sm text-blue-800 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 w-fit border border-blue-200/60">
                  <CheckCircle className="h-4 w-4 text-blue-700" />
                  Dipercaya civitas akademika UTY
                </div>

                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Portal{" "}
                    <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                      HKI UTY
                    </span>{" "}
                    Creative Hub
                  </h1>
                  <p className="max-w-[600px] text-lg md:text-xl text-slate-600 leading-relaxed">
                    Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual. 
                    Khusus untuk mahasiswa, dosen, dan masyarakat umum dengan proses yang mudah dan terintegrasi.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex flex-row items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    Mulai Pendaftaran HKI
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-blue-800 hover:border-blue-700 text-blue-800 hover:text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-blue-50">
                    Panduan Lengkap
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">500+</div>
                    <div className="text-sm text-slate-600">HKI Terdaftar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">98%</div>
                    <div className="text-sm text-slate-600">Tingkat Approval</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">UTY</div>
                    <div className="text-sm text-slate-600">Creative Hub</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Hero Image */}
              <div className="relative mx-4">
                <div className="relative bg-gradient-to-br from-blue-300 to-blue-400 rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-blue-300 to-blue-200 rounded-2xl shadow-inner flex items-center justify-center">
                    <Image
                      src="/Hero.svg"
                      alt="Hero Image"
                      width={400}
                      height={400}
                      className="rounded-2xl object-cover"
                    />
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-blue-800">Aktif 24/7</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-blue-200/60">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-800" />
                    <span className="text-sm font-medium text-blue-800">Civitas UTY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="fitur" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                Fitur Unggulan
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Mengapa Memilih{" "}
                <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                  UTY HKI Portal?
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
                Platform terintegrasi yang memudahkan civitas akademika UTY dan masyarakat umum dalam proses pendaftaran HKI dengan dukungan penuh dari Creative Hub.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Formulir Digital Terintegrasi",
                  description: "Sistem formulir online yang memudahkan pengisian data HKI dengan validasi otomatis dan panduan lengkap.",
                  color: "from-blue-800 to-blue-900"
                },
                {
                  icon: BarChart,
                  title: "Tracking Status Real-time",
                  description: "Pantau progress pendaftaran HKI Anda dari tahap administratif hingga persetujuan final dengan notifikasi otomatis.",
                  color: "from-blue-700 to-blue-800"
                },
                {
                  icon: ShieldCheck,
                  title: "Verifikasi Bertahap",
                  description: "Sistem review dua tahap oleh admin untuk memastikan kelengkapan substansi, administratif, dan dokumen pendukung.",
                  color: "from-slate-700 to-slate-800"
                },
                {
                  icon: Clock,
                  title: "Proses Efisien",
                  description: "Workflow yang disederhanakan mulai dari upload dokumen, review, hingga finalisasi dengan timeline yang jelas.",
                  color: "from-blue-600 to-blue-700"
                },
                {
                  icon: Users,
                  title: "Dukungan UTY Creative Hub",
                  description: "Bantuan penuh dari tim Creative Hub UTY untuk bimbingan teknis dan konsultasi selama proses pendaftaran.",
                  color: "from-slate-600 to-slate-700"
                },
                {
                  icon: GraduationCap,
                  title: "Fleksibilitas Civitas Akademika",
                  description: "Diperuntukkan untuk mahasiswa, dosen UTY, dan masyarakat umum dengan prosedur yang disesuaikan kebutuhan akademik.",
                  color: "from-blue-900 to-slate-800"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="w-full py-16 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Alur Pendaftaran{" "}
                <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                  HKI
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
                Proses pendaftaran HKI yang mudah dan terintegrasi dengan sistem review bertahap untuk memastikan kualitas pengajuan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Login & Registrasi",
                  description: "Akses portal menggunakan email dan lengkapi profil Anda sebagai civitas UTY atau masyarakat umum."
                },
                {
                  step: "02", 
                  title: "Upload Dokumen",
                  description: "Lengkapi formulir HKI dan upload dokumen: KTP, contoh karya, materai, dan bukti pembayaran."
                },
                {
                  step: "03",
                  title: "Review Tahap 1",
                  description: "Admin melakukan verifikasi substansi dan administratif. Notifikasi dikirim jika ada revisi."
                },
                {
                  step: "04",
                  title: "Finalisasi & Approval",
                  description: "Upload surat pernyataan untuk review tahap 2. Status berubah menjadi disetujui setelah lengkap."
                }
              ].map((process, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg shadow-lg">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{process.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-800">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Siap Daftarkan HKI Anda?
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-blue-100">
                Bergabunglah dengan civitas akademika UTY dan masyarakat yang telah mempercayakan pendaftaran HKI mereka melalui UTY Creative Hub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Mulai Pendaftaran
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                  Hubungi Creative Hub
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6 mx-auto py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-800">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 font-bold text-xl text-slate-900">UTY HKI Portal</span>
              </div>
              <p className="text-slate-600">
                Platform resmi Universitas Teknologi Yogyakarta untuk pendaftaran Hak Kekayaan Intelektual melalui Creative Hub.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Layanan HKI</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-800 transition-colors">Hak Cipta</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Paten</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Merek Dagang</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Desain Industri</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">UTY Creative Hub</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-800 transition-colors">Tentang Creative Hub</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Tim</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Program</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Dukungan</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-800 transition-colors">Panduan HKI</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-blue-800 transition-colors">Konsultasi</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} UTY Creative Hub. Universitas Teknologi Yogyakarta.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
                Ketentuan Layanan
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-blue-800 transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}