"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, FileText, DollarSign, MapPin, Calendar as CalendarLucide, Type } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormValues } from "@/lib/pendaftaran/schema";
import { copyrightCategories } from "@/lib/master/copyrightCategories";

// Import komponen UI
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function Step1InformasiKarya() {
  const { control, setValue, watch } = useFormContext<FormValues>();

  const selectedJenisKarya = watch("jenis_karya");
  const selectedCategoryData = copyrightCategories[selectedJenisKarya];
  const deskripsiValue = watch("deskripsi_karya");

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-blue-200/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
      
      <CardHeader className="pb-3 sm:pb-4 relative">
        <CardTitle className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
              1. Informasi Detail Hak Cipta
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Data lengkap tentang karya yang akan didaftarkan
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 relative">
        {/* Basic Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <Type className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Informasi Dasar Karya</h4>
          </div>

          <FormField
            control={control}
            name="judul"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Judul Karya *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Aplikasi Portal HKI"
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
            name="produk_hasil"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Produk Hasil *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Perangkat Lunak, Buku, Lagu"
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
              name="jenis_karya"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">Jenis Karya *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("sub_jenis_karya", ""); // Reset sub-jenis
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue placeholder="Pilih jenis..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(copyrightCategories).map(
                        ([key, category]) => (
                          <SelectItem key={key} value={key}>
                            {category.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="sub_jenis_karya"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                    Sub-Jenis Karya *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategoryData || selectedCategoryData.subCategories.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base">
                        <SelectValue
                          placeholder={
                            selectedCategoryData && selectedCategoryData.subCategories.length > 0
                              ? "Pilih sub-jenis..."
                              : "Pilih jenis karya dahulu"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategoryData?.subCategories.map(
                        (subCategory, index) => (
                          <SelectItem key={index} value={subCategory}>
                            {subCategory}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Asset Value Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Nilai Aset</h4>
          </div>

          <FormField
            control={control}
            name="nilai_aset_karya"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                  Nilai Aset Karya (Rp) *
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5000000" 
                    className="bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Publication Information Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Informasi Publikasi</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={control}
              name="kota_diumumkan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                    Kota Pertama Diumumkan *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Yogyakarta" 
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
              name="tanggal_diumumkan"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <CalendarLucide className="h-3 w-3" />
                    Tanggal Pertama Diumumkan *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base",
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-blue-200/50">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">Deskripsi Karya</h4>
          </div>

          <FormField
            control={control}
            name="deskripsi_karya"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs sm:text-sm font-semibold text-slate-700">
                  Deskripsi Singkat Karya *
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan secara singkat tentang esensi, fungsi, dan keunggulan karya Anda..."
                    className="min-h-[100px] sm:min-h-[120px] bg-white/80 border-blue-200/50 focus:border-blue-400 focus:ring-blue-200/50 transition-all duration-300 hover:bg-white text-sm sm:text-base resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs sm:text-sm text-slate-600">
                  Minimal 20 karakter. Saat ini: {deskripsiValue?.length || 0} karakter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}