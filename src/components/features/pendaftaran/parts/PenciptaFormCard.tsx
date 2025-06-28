"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trash2, User, MapPin, Phone, Mail, GraduationCap, Globe } from "lucide-react";

import { FormValues } from "@/lib/pendaftaran/schema";
import { cn } from "@/lib/utils";

// Import semua komponen UI yang dibutuhkan
import { Button } from "@/components/ui/button";
import {
  FormControl,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Menerima props baru dari Step2DataPencipta
interface PenciptaFormCardProps {
  index: number;
  onRemove: (index: number) => void;
  provinces: any[];
  cities: any[];
  districts: any[];
  villages: any[];
  setCitiesForIndex: (cities: any[]) => void;
  setDistrictsForIndex: (districts: any[]) => void;
  setVillagesForIndex: (villages: any[]) => void;
}

export function PenciptaFormCard({
  index,
  onRemove,
  provinces,
  cities,
  districts,
  villages,
  setCitiesForIndex,
  setDistrictsForIndex,
  setVillagesForIndex,
}: PenciptaFormCardProps) {
  const { control, setValue } = useFormContext<FormValues>();
  const [isLoading, setIsLoading] = useState({
    cities: false,
    districts: false,
    villages: false,
  });

  const API_KEY = process.env.NEXT_PUBLIC_BINDERBYTE_API_KEY;

  const getCities = async (provinceId: string) => {
    if (!provinceId) return;
    setIsLoading((prev) => ({ ...prev, cities: true }));
    setDistrictsForIndex([]); // Reset data anak
    setVillagesForIndex([]); // Reset data anak
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kabupaten?api_key=${API_KEY}&id_provinsi=${provinceId}`
      );
      const data = await response.json();
      setCitiesForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kota:", error);
      setCitiesForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  const getDistricts = async (cityId: string) => {
    if (!cityId) return;
    setIsLoading((prev) => ({ ...prev, districts: true }));
    setVillagesForIndex([]); // Reset data anak
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kecamatan?api_key=${API_KEY}&id_kabupaten=${cityId}`
      );
      const data = await response.json();
      setDistrictsForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kecamatan:", error);
      setDistrictsForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const getVillages = async (districtId: string) => {
    if (!districtId) return;
    setIsLoading((prev) => ({ ...prev, villages: true }));
    try {
      const response = await fetch(
        `https://api.binderbyte.com/wilayah/kelurahan?api_key=${API_KEY}&id_kecamatan=${districtId}`
      );
      const data = await response.json();
      setVillagesForIndex(data.value || []);
    } catch (error) {
      console.error("Gagal mengambil data kelurahan:", error);
      setVillagesForIndex([]);
    } finally {
      setIsLoading((prev) => ({ ...prev, villages: false }));
    }
  };

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-blue-200/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
      
      <CardHeader className="pb-3 sm:pb-4 relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                Pencipta {index + 1}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Informasi lengkap pencipta karya
              </p>
            </div>
          </div>
          {index > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Hapus</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 relative">
        {/* Personal Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Informasi Personal</h4>
          </div>

          <FormField
            control={control}
            name={`pencipta.${index}.nama_lengkap`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nama sesuai KTP" 
                    className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.nik`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">NIK *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="16 digit NIK" 
                      maxLength={16} 
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.nip_nim`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">NIP / NIM *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nomor Induk Pegawai/Mahasiswa"
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.jenis_kelamin`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Jenis Kelamin *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue placeholder="Pilih jenis kelamin..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kewarganegaraan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Kewarganegaraan *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Indonesia"
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Informasi Kontak</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nama@example.com"
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.no_hp`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    No. HP / WhatsApp *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="08123456789" 
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Informasi Akademik</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.fakultas`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Fakultas *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Contoh: Sains & Teknologi" 
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.program_studi`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Program Studi *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Contoh: Informatika" 
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Alamat Sesuai KTP</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={control}
              name={`pencipta.${index}.provinsi`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Provinsi *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue(`pencipta.${index}.kota`, "");
                      setValue(`pencipta.${index}.kecamatan`, "");
                      setValue(`pencipta.${index}.kelurahan`, "");
                      getCities(value);
                    }}
                    value={field.value}
                    disabled={provinces.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue
                          placeholder={
                            provinces.length === 0 ? "Memuat..." : "Pilih Provinsi"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kota`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                    Kota / Kabupaten *
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue(`pencipta.${index}.kecamatan`, "");
                      setValue(`pencipta.${index}.kelurahan`, "");
                      getDistricts(value);
                    }}
                    value={field.value}
                    disabled={cities.length === 0 || isLoading.cities}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue
                          placeholder={
                            isLoading.cities ? "Memuat..." : "Pilih Kota/Kab."
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kecamatan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Kecamatan *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue(`pencipta.${index}.kelurahan`, "");
                      getVillages(value);
                    }}
                    value={field.value}
                    disabled={districts.length === 0 || isLoading.districts}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue
                          placeholder={
                            isLoading.districts ? "Memuat..." : "Pilih Kecamatan"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`pencipta.${index}.kelurahan`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                    Kelurahan / Desa *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={villages.length === 0 || isLoading.villages}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue
                          placeholder={
                            isLoading.villages
                              ? "Memuat..."
                              : "Pilih Kelurahan/Desa"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {villages.map((village) => (
                        <SelectItem key={village.id} value={village.id}>
                          {village.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <FormField
                control={control}
                name={`pencipta.${index}.alamat_lengkap`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                      Alamat Lengkap (Sesuai KTP) *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jl. Contoh No. 123, RT 01 RW 02..."
                        className="min-h-[80px] sm:min-h-[100px] bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`pencipta.${index}.kode_pos`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Kode Pos *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="55281" 
                      maxLength={5} 
                      className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}