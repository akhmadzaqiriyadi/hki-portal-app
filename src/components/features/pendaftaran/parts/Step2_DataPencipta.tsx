"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircle, User, Users } from "lucide-react";

import { FormValues, defaultPencipta } from "@/lib/pendaftaran/schema";
import { PenciptaFormCard } from "./PenciptaFormCard";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Terima props dari komponen induk
interface Step2Props {
    provinces: any[];
    cities: any[][];
    districts: any[][];
    villages: any[][];
    setCities: React.Dispatch<React.SetStateAction<any[][]>>;
    setDistricts: React.Dispatch<React.SetStateAction<any[][]>>;
    setVillages: React.Dispatch<React.SetStateAction<any[][]>>;
}

export function Step2DataPencipta({
    provinces, cities, districts, villages,
    setCities, setDistricts, setVillages
}: Step2Props) {
    const { control } = useFormContext<FormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "pencipta",
    });

    const addPencipta = () => {
        append(defaultPencipta);
        // Tambahkan array kosong baru untuk state wilayah pencipta baru
        setCities(prev => [...prev, []]);
        setDistricts(prev => [...prev, []]);
        setVillages(prev => [...prev, []]);
    };

    const removePencipta = (index: number) => {
        remove(index);
        // Hapus state wilayah yang terkait dengan pencipta yang dihapus
        setCities(prev => prev.filter((_, i) => i !== index));
        setDistricts(prev => prev.filter((_, i) => i !== index));
        setVillages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-blue-200/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
                
                <CardHeader className="pb-3 sm:pb-4 relative">
                    <CardTitle className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                                2. Detail Data Pencipta
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium">
                                Informasi lengkap tentang pencipta karya
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <div className="flex items-center gap-2 sm:gap-3 pb-3 border-b border-blue-200/50">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
                                Daftar Pencipta ({fields.length})
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600">
                                Anda dapat menambahkan lebih dari satu pencipta untuk karya ini
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pencipta Cards */}
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <PenciptaFormCard
                        key={field.id}
                        index={index}
                        onRemove={removePencipta}
                        // Teruskan semua props yang relevan ke setiap card
                        provinces={provinces}
                        cities={cities[index] || []}
                        districts={districts[index] || []}
                        villages={villages[index] || []}
                        setCitiesForIndex={(newCities) => {
                            setCities(current => {
                                const newArr = [...current];
                                newArr[index] = newCities;
                                return newArr;
                            });
                        }}
                        setDistrictsForIndex={(newDistricts) => {
                             setDistricts(current => {
                                const newArr = [...current];
                                newArr[index] = newDistricts;
                                return newArr;
                            });
                        }}
                        setVillagesForIndex={(newVillages) => {
                            setVillages(current => {
                                const newArr = [...current];
                                newArr[index] = newVillages;
                                return newArr;
                            });
                        }}
                    />
                ))}
            </div>

            {/* Add Button Card */}
            <Card className="border-dashed border-2 border-blue-300/50 bg-gradient-to-br from-blue-50/30 to-blue-100/20 backdrop-blur-sm hover:border-blue-400/50 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-blue-100/30 transition-all duration-300 relative overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 relative">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-blue-200/5 rounded-lg pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-base sm:text-lg font-semibold text-slate-800">
                                Tambah Pencipta Lain
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                                Klik tombol di bawah untuk menambahkan pencipta tambahan jika karya ini dibuat oleh lebih dari satu orang
                            </p>
                        </div>
                        <Button 
                            type="button" 
                            onClick={addPencipta}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2 text-sm sm:text-base"
                        >
                            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Tambah Pencipta
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}