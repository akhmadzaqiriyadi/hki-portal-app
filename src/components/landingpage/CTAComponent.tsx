import React from 'react';

type HeaderProps = {
  onRegister: () => void;
};

export default function CTASection({ onRegister }: HeaderProps) {
  return (
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
            <button 
              className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              onClick={onRegister}
            >
              Mulai Pendaftaran
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
              Hubungi Creative Hub
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}