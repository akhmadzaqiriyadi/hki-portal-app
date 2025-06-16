'use client';
import React from 'react';
import { ArrowRight, FileText, BarChart, ShieldCheck, CheckCircle, Users, Clock, Award, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with improved design */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Portal HKI
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-8">
          <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Fitur
          </a>
          <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Tentang
          </a>
          <a href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Masuk
          </a>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"       onClick={() => router.push("/register")}>
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
              <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-blue-600">Fitur</a>
              <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-blue-600">Tentang</a>
              <a href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Masuk</a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium w-full">
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
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>

          <div className="relative container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                {/* Trust badge */}
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 w-fit border border-slate-200/60">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Dipercaya oleh 10,000+ pengguna
                </div>

                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Lindungi{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Karya Intelektual
                    </span>{" "}
                    Anda dengan Mudah
                  </h1>
                  <p className="max-w-[600px] text-lg md:text-xl text-slate-600 leading-relaxed">
                    Platform digital terdepan untuk pendaftaran Hak Kekayaan Intelektual. 
                    Proses cepat, aman, dan transparan dengan dukungan expert sepanjang waktu.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    Mulai Pendaftaran
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-blue-50">
                    Pelajari Lebih Lanjut
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">10K+</div>
                    <div className="text-sm text-slate-600">Pengguna Aktif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">99%</div>
                    <div className="text-sm text-slate-600">Tingkat Kepuasan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">24/7</div>
                    <div className="text-sm text-slate-600">Dukungan</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Hero Image */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <ShieldCheck className="h-10 w-10 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Keamanan Terjamin</h3>
                        <p className="text-slate-600">Teknologi enkripsi tingkat bank</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Online</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">150+ Expert</span>
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
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="h-4 w-4" />
                Fitur Unggulan
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Mengapa Memilih{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portal HKI?
                </span>
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
                Kami menyediakan solusi lengkap untuk semua kebutuhan HKI Anda dengan teknologi terdepan dan layanan profesional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Pengajuan Online",
                  description: "Ajukan permohonan HKI kapan saja, di mana saja melalui platform digital yang mudah digunakan.",
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: BarChart,
                  title: "Tracking Real-time",
                  description: "Pantau status permohonan Anda secara real-time dengan notifikasi otomatis di setiap tahap.",
                  color: "from-indigo-500 to-indigo-600"
                },
                {
                  icon: ShieldCheck,
                  title: "Keamanan Maksimal",
                  description: "Data dan dokumen Anda dilindungi dengan enkripsi tingkat militer dan backup otomatis.",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: Clock,
                  title: "Proses Cepat",
                  description: "Percepat proses pendaftaran dengan sistem otomatis dan dukungan tim expert kami.",
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: Users,
                  title: "Konsultasi Expert",
                  description: "Dapatkan konsultasi gratis dari para ahli HKI berpengalaman untuk memaksimalkan perlindungan.",
                  color: "from-orange-500 to-orange-600"
                },
                {
                  icon: Award,
                  title: "Jaminan Kualitas",
                  description: "Kami berkomitmen memberikan layanan terbaik dengan tingkat keberhasilan 99% dalam pendaftaran.",
                  color: "from-pink-500 to-pink-600"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-2">
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

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Siap Melindungi Karya Intelektual Anda?
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-blue-100">
                Bergabunglah dengan ribuan inovator yang telah mempercayakan perlindungan HKI mereka kepada kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Mulai Gratis Sekarang
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                  Hubungi Tim Kami
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
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 font-bold text-xl text-slate-900">Portal HKI</span>
              </div>
              <p className="text-slate-600">
                Platform terpercaya untuk melindungi karya intelektual Anda dengan teknologi terdepan.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Layanan</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pendaftaran Paten</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Merek Dagang</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Hak Cipta</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Desain Industri</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tim</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Dukungan</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Status Layanan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Portal HKI. Semua hak dilindungi.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Ketentuan Layanan
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}