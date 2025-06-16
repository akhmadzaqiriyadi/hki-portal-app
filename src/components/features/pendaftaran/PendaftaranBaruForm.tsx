"use client";

import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createNewRegistration,
  updateRegistration,
  FormState,
} from "@/lib/supabase/actions";
import { format } from "date-fns";
import { FileUpload } from "./FileUpload";

// Import semua komponen UI yang dibutuhkan
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  FileText,
  UploadCloud,
  Loader2,
} from "lucide-react";

// Skema Zod yang diperbarui dengan SEMUA field, termasuk scan_ktp_url
const formSchema = z.object({
  judul: z.string().min(5, "Judul karya wajib diisi."),
  produk_hasil: z.string().min(1, "Produk hasil wajib diisi."),
  jenis_karya: z.string().min(1, "Jenis karya harus dipilih."),
  sub_jenis_karya: z.string().min(1, "Sub-jenis karya wajib diisi."),
  nilai_aset_karya: z.coerce.number().min(1, "Nilai aset karya wajib diisi."),
  kota_diumumkan: z.string().min(1, "Kota diumumkan wajib diisi."),
  tanggal_diumumkan: z.date({
    required_error: "Tanggal diumumkan wajib diisi.",
  }),
  deskripsi_karya: z.string().min(20, "Deskripsi minimal 20 karakter."),
  lampiran_karya_url: z.string().optional(),
  bukti_transfer_url: z.string().optional(),
  surat_pernyataan_url: z.string().optional(),
  surat_pengalihan_url: z.string().optional(),
  pencipta: z
    .array(
      z.object({
        nama_lengkap: z.string().min(3, "Nama lengkap wajib diisi."),
        nik: z
          .string()
          .min(16, "NIK harus 16 digit.")
          .max(16, "NIK harus 16 digit."),
        nip_nim: z.string().min(1, "NIP/NIM wajib diisi."),
        email: z.string().email("Format email tidak valid."),
        jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih."),
        no_hp: z.string().min(10, "No HP minimal 10 digit."),
        fakultas: z.string().min(1, "Fakultas wajib diisi."),
        program_studi: z.string().min(1, "Program studi wajib diisi."),
        kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi."),
        negara: z.string().min(1, "Negara wajib diisi."),
        provinsi: z.string().min(1, "Provinsi wajib diisi."),
        kota: z.string().min(1, "Kota wajib diisi."),
        kecamatan: z.string().min(1, "Kecamatan wajib diisi."),
        kelurahan: z.string().min(1, "Kelurahan wajib diisi."),
        alamat_lengkap: z.string().min(10, "Alamat lengkap wajib diisi."),
        kode_pos: z.string().min(5, "Kode pos wajib diisi."),
        scan_ktp_url: z.string().optional(), // ✅ Field KTP ditambahkan
      })
    )
    .min(1, "Minimal harus ada satu pencipta."),
});

type FormValues = z.infer<typeof formSchema>;

const defaultPencipta = {
  nama_lengkap: "",
  nik: "",
  nip_nim: "",
  email: "",
  jenis_kelamin: "",
  no_hp: "",
  fakultas: "",
  program_studi: "",
  kewarganegaraan: "Indonesia",
  negara: "Indonesia",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  alamat_lengkap: "",
  kode_pos: "",
  scan_ktp_url: "", // ✅ Field KTP ditambahkan
};

const steps = [
  { id: 1, title: "Informasi Karya", icon: FileText },
  { id: 2, title: "Data Pencipta", icon: User },
  { id: 3, title: "Unggah Dokumen", icon: UploadCloud },
];

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // ✅ PERBAIKAN UTAMA: "Bersihkan" initialData dari nilai NULL
    defaultValues: initialData
      ? {
          // Menggunakan '|| ""' untuk mengubah NULL menjadi string kosong
          judul: initialData.judul || "",
          produk_hasil: initialData.produk_hasil || "",
          jenis_karya: initialData.jenis_karya || "",
          sub_jenis_karya: initialData.sub_jenis_karya || "",
          // Menggunakan '|| undefined' untuk angka agar placeholder muncul
          nilai_aset_karya: initialData.nilai_aset_karya || undefined,
          kota_diumumkan: initialData.kota_diumumkan || "",
          deskripsi_karya: initialData.deskripsi_karya || "",
          // Konversi string tanggal dari DB ke objek Date untuk kalender
          tanggal_diumumkan: initialData.tanggal_diumumkan
            ? new Date(initialData.tanggal_diumumkan)
            : undefined,
          // URL file bisa undefined
          lampiran_karya_url: initialData.lampiran_karya_url || undefined,
          bukti_transfer_url: initialData.bukti_transfer_url || undefined,
          surat_pernyataan_url: initialData.surat_pernyataan_url || undefined,
          surat_pengalihan_url: initialData.surat_pengalihan_url || undefined,
          // Lakukan hal yang sama untuk setiap pencipta
          pencipta: initialData.pencipta?.map((p) => ({
            ...defaultPencipta,
            ...p,
            nik: p.nik || "", // Pastikan semua field pencipta juga dibersihkan
            nip_nim: p.nip_nim || "",
            email: p.email || "",
            // ...dan seterusnya untuk semua field pencipta
          })) || [defaultPencipta],
        }
      : {
          // Bagian ini untuk mode 'create', tidak berubah
          judul: "",
          // ...sisa default values
          pencipta: [defaultPencipta],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pencipta",
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "pencipta") formData.append(key, JSON.stringify(value));
      else if (key === "tanggal_diumumkan" && value instanceof Date)
        formData.append(key, format(value, "yyyy-MM-dd"));
      else if (value !== null && value !== undefined)
        formData.append(key, String(value));
    });

    let result: FormState;
    if (isEditMode) {
      result = await updateRegistration(pendaftaranId, formData);
    } else {
      result = await createNewRegistration(formData);
    }

    if (result && !result.success) setServerState(result);
  };

  const validateStep = async (step: number) => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1)
      fieldsToValidate = [
        "judul",
        "produk_hasil",
        "jenis_karya",
        "sub_jenis_karya",
        "nilai_aset_karya",
        "kota_diumumkan",
        "tanggal_diumumkan",
        "deskripsi_karya",
      ];
    else if (step === 2) fieldsToValidate = ["pencipta"];
    return await form.trigger(fieldsToValidate);
  };

  const handleNext = async () => {
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

  const handleStepClick = async (stepNumber: number) => {
    if (completedSteps.includes(stepNumber - 1) || stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <nav className="flex items-center justify-center space-x-4 md:space-x-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible =
            currentStep > step.id ||
            isCurrent ||
            completedSteps.includes(step.id - 1);
          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={!isAccessible}
                className="flex flex-col items-center text-center space-y-2"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-primary border-primary text-primary-foreground"
                      : isAccessible
                      ? "bg-background border-border hover:border-primary"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm font-medium w-28",
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-auto border-t-2 transition-all duration-300 mx-4",
                    completedSteps.includes(step.id)
                      ? "border-green-500"
                      : "border-border"
                  )}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <Form {...form}>
        <form className="space-y-6">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>1. Informasi Detail Hak Cipta</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <FormField
                  control={form.control}
                  name="judul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Judul Karya *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Aplikasi Portal HKI"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="produk_hasil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Produk Hasil *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Perangkat Lunak, Buku, Lagu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jenis_karya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Jenis Karya *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Karya Tulis">
                              Karya Tulis
                            </SelectItem>
                            <SelectItem value="Karya Seni">
                              Karya Seni
                            </SelectItem>
                            <SelectItem value="Audiovisual">
                              Audiovisual
                            </SelectItem>
                            <SelectItem value="Program Komputer">
                              Program Komputer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sub_jenis_karya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Sub-Jenis Karya *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Aplikasi Mobile"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="nilai_aset_karya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nilai Aset Karya (Rp) *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="kota_diumumkan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Kota Pertama Diumumkan *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Yogyakarta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tanggal_diumumkan"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Tanggal Pertama Diumumkan *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deskripsi_karya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Deskripsi Singkat Karya *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan secara singkat tentang esensi, fungsi, dan keunggulan karya Anda..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimal 20 karakter. Saat ini:{" "}
                        {field.value?.length || 0} karakter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>2. Detail Data Pencipta</span>
                </CardTitle>
                <FormDescription>
                  Anda bisa menambahkan lebih dari satu pencipta untuk karya
                  ini.
                </FormDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-6 border-2 p-6 rounded-lg relative bg-gray-50/50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">
                        Pencipta {index + 1}
                      </h3>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.nama_lengkap`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Nama Lengkap *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.nik`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              NIK *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="16 digit NIK"
                                maxLength={16}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.nip_nim`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              NIP / NIM *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Email *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="nama@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.no_hp`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              No. HP / WhatsApp *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="08123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.jenis_kelamin`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Jenis Kelamin *
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis kelamin..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Laki-laki">
                                  Laki-laki
                                </SelectItem>
                                <SelectItem value="Perempuan">
                                  Perempuan
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.fakultas`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Fakultas *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.program_studi`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Program Studi *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.kewarganegaraan`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Kewarganegaraan *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.negara`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Negara *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`pencipta.${index}.alamat_lengkap`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Alamat Lengkap (Sesuai KTP) *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Jl. Contoh No. 123, RT 01 RW 02..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.provinsi`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Provinsi *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.kota`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Kota / Kabupaten *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.kecamatan`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Kecamatan *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.kelurahan`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Kelurahan / Desa *
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.kode_pos`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Kode Pos *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="55281"
                                maxLength={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* ✅ BLOK BARU UNTUK UPLOAD KTP */}
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`pencipta.${index}.scan_ktp_url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Scan KTP
                            </FormLabel>
                            <FormControl>
                              <FileUpload field={field} />
                            </FormControl>
                            <FormDescription>
                              Unggah scan KTP pencipta ini. (PDF/JPG/PNG, maks
                              5MB)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => append(defaultPencipta)}
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Tambah Pencipta Lain
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UploadCloud className="w-5 h-5" />
                  <span>3. Unggah Dokumen Pendukung</span>
                </CardTitle>
                <FormDescription>
                  Unggah file yang diperlukan. (Maks 5MB per file).
                </FormDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <FormField
                  control={form.control}
                  name="lampiran_karya_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Lampiran Contoh Karya
                      </FormLabel>
                      <FormControl>
                        <FileUpload field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bukti_transfer_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Bukti Transfer Pembayaran
                      </FormLabel>
                      <FormControl>
                        <FileUpload field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surat_pernyataan_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Surat Pernyataan (PDF)
                      </FormLabel>
                      <FormControl>
                        <FileUpload field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surat_pengalihan_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Surat Pengalihan Hak (PDF)
                      </FormLabel>
                      <FormControl>
                        <FileUpload field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length ? (
                <Button type="button" size="lg" onClick={handleNext}>
                  Selanjutnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {isEditMode ? "Simpan Perubahan" : "Kirim Pendaftaran"}
                </Button>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {serverState && !serverState.success && serverState.message && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>
                {serverState.message || "Terjadi kesalahan."}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  );
}
