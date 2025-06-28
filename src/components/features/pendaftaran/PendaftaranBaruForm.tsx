"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Loader2,
  UploadCloud,
  User,
  Sparkles,
  Shield,
  Award,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formSchema,
  FormValues,
  defaultPencipta,
} from "@/lib/pendaftaran/schema";
import {
  createNewRegistration,
  updateRegistration,
  FormState,
} from "@/lib/supabase/actions";

import { Step1InformasiKarya } from "./parts/Step1_InformasiKarya";
import { Step2DataPencipta } from "./parts/Step2_DataPencipta";
import { Step3UnggahDokumen } from "./parts/Step3_UnggahDokumen";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { id: 1, title: "Informasi Karya", icon: FileText, description: "Detail karya yang akan didaftarkan" },
  { id: 2, title: "Data Pencipta", icon: User, description: "Informasi lengkap pencipta" },
  { id: 3, title: "Unggah Dokumen", icon: UploadCloud, description: "Dokumen pendukung pendaftaran" },
];

interface Wilayah {
  id: string;
  name: string;
}

interface PendaftaranBaruFormProps {
  initialData?: Partial<FormValues>;
  pendaftaranId?: string;
}

export function PendaftaranBaruForm({
  initialData,
  pendaftaranId,
}: PendaftaranBaruFormProps) {
  const [serverState, setServerState] = useState<FormState | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const isEditMode = !!pendaftaranId;

  const [provinces, setProvinces] = useState<Wilayah[]>([]);
  const [cities, setCities] = useState<Wilayah[][]>([[]]);
  const [districts, setDistricts] = useState<Wilayah[][]>([[]]);
  const [villages, setVillages] = useState<Wilayah[][]>([[]]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      pencipta: [defaultPencipta],
      judul: "",
      produk_hasil: "",
      jenis_karya: "",
      sub_jenis_karya: "",
      kota_diumumkan: "",
      deskripsi_karya: "",
      jenis_pemilik: undefined,
      tanggal_diumumkan: undefined,
      nilai_aset_karya: undefined,
      lampiran_karya_url: "",
      bukti_transfer_url: "",
      surat_pernyataan_url: "",
      scan_ktp_kolektif_url: "",
      surat_pengalihan_url: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const dataWithDate = {
        ...initialData,
        tanggal_diumumkan: initialData.tanggal_diumumkan
          ? new Date(initialData.tanggal_diumumkan)
          : undefined,
      };
      form.reset(dataWithDate);
    }
  }, [initialData, form.reset]);

  useEffect(() => {
    const getProvinces = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_BINDERBYTE_API_KEY;
      try {
        const response = await fetch(
          `https://api.binderbyte.com/wilayah/provinsi?api_key=${API_KEY}`
        );
        const data = await response.json();
        if (data && Array.isArray(data.value)) {
          setProvinces(data.value);
        }
      } catch (error) {
        console.error("Gagal mengambil data provinsi:", error);
      }
    };
    getProvinces();
  }, []);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "pencipta") {
        const resolvedPencipta = values.pencipta.map((p, index) => {
          const provinceName =
            provinces.find((prov) => prov.id === p.provinsi)?.name ||
            p.provinsi;
          const cityName =
            cities[index]?.find((city) => city.id === p.kota)?.name || p.kota;
          const districtName =
            districts[index]?.find((dist) => dist.id === p.kecamatan)?.name ||
            p.kecamatan;
          const villageName =
            villages[index]?.find((vill) => vill.id === p.kelurahan)?.name ||
            p.kelurahan;
          return {
            ...p,
            provinsi: provinceName,
            kota: cityName,
            kecamatan: districtName,
            kelurahan: villageName,
          };
        });
        formData.append(key, JSON.stringify(resolvedPencipta));
      } else if (key === "tanggal_diumumkan" && value instanceof Date) {
        formData.append(key, format(value, "yyyy-MM-dd"));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const result = isEditMode
      ? await updateRegistration(pendaftaranId!, formData)
      : await createNewRegistration(formData);

    if (result && !result.success) {
      setServerState(result);
    }
  };

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "judul", "produk_hasil", "jenis_karya", "sub_jenis_karya",
        "nilai_aset_karya", "kota_diumumkan", "tanggal_diumumkan", "deskripsi_karya",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["pencipta"];
    } else if (step === 3) {
      fieldsToValidate = [
        "jenis_pemilik", "bukti_transfer_url", "scan_ktp_kolektif_url",
        "lampiran_karya_url", "surat_pernyataan_url", "surat_pengalihan_url",
      ];
    }
    return await form.trigger(fieldsToValidate);
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="relative min-h-screen">
      {/* Background decorations matching dashboard */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-slate-800/3 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl items-center justify-center shadow-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  {isEditMode ? "Edit Pendaftaran HKI" : "Pendaftaran HKI Baru"}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                  {isEditMode ? "Perbarui informasi pendaftaran Anda" : "Daftarkan karya intelektual Anda dengan mudah"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <nav className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-3">
                      <div
                        className={cn(
                          "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full sm:rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-lg hover:shadow-xl",
                          isCompleted
                            ? "bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-green-200"
                            : isCurrent
                            ? "bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 text-white shadow-blue-200"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-500"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                        ) : (
                          <step.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                        )}
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className={cn(
                          "text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold leading-tight",
                          isCurrent
                            ? "text-blue-900"
                            : isCompleted
                            ? "text-green-700"
                            : "text-slate-500"
                        )}>
                          {step.title}
                        </p>
                        <p className={cn(
                          "text-[8px] sm:text-xs text-center max-w-16 sm:max-w-20 md:max-w-32 lg:max-w-40 leading-tight hidden sm:block",
                          isCurrent || isCompleted
                            ? "text-slate-600"
                            : "text-slate-400"
                        )}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-auto border-t-2 transition-all duration-300 mx-1 sm:mx-2 md:mx-4 lg:mx-8 min-w-4 sm:min-w-8 md:min-w-12 lg:min-w-16",
                          completedSteps.includes(step.id)
                            ? "border-green-400"
                            : isCurrent
                            ? "border-blue-300"
                            : "border-slate-300"
                        )}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/20 backdrop-blur-sm shadow-xl">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <FormProvider {...form}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {currentStep === 1 && <Step1InformasiKarya />}
                  {currentStep === 2 && (
                    <Step2DataPencipta
                      provinces={provinces}
                      cities={cities}
                      districts={districts}
                      villages={villages}
                      setCities={setCities}
                      setDistricts={setDistricts}
                      setVillages={setVillages}
                    />
                  )}
                  {currentStep === 3 && <Step3UnggahDokumen />}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8 border-t border-blue-200/50">
                    <div className="flex-1 flex justify-start w-full sm:w-auto">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          className="sm:size-lg w-full sm:w-auto"
                          onClick={handlePrevious}
                        >
                          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-sm sm:text-base">Kembali</span>
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 flex justify-end w-full sm:w-auto">
                      {currentStep < steps.length ? (
                        <Button 
                          type="button" 
                          size="default"
                          className="sm:size-lg w-full sm:w-auto bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          onClick={handleNext}
                        >
                          <span className="text-sm sm:text-base">Selanjutnya</span>
                          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          size="default"
                          className="sm:size-lg w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              <span className="text-sm sm:text-base">
                                {isEditMode ? "Menyimpan..." : "Mengirim..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="text-sm sm:text-base">
                                {isEditMode ? "Simpan Perubahan" : "Kirim Pendaftaran"}
                              </span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Error Alert */}
                  {serverState && !serverState.success && serverState.message && (
                    <Alert variant="destructive" className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-lg">
                      <AlertTitle className="font-semibold text-sm sm:text-base">Gagal Menyimpan</AlertTitle>
                      <AlertDescription className="font-medium text-xs sm:text-sm">
                        {serverState.message || "Terjadi kesalahan."}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Tips Panel */}
        <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                  Tips untuk Pendaftaran yang Sukses
                </h4>
                <p className="text-[10px] sm:text-xs md:text-sm text-amber-700 leading-relaxed">
                  Pastikan semua informasi yang diisi akurat dan lengkap. Upload dokumen dalam format PDF dengan ukuran maksimal 5MB untuk hasil terbaik. Proses review biasanya memakan waktu 7-14 hari kerja.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}