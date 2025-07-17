"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  Calendar,
  Award
} from "lucide-react";

interface SertifikatViewProps {
  sertifikat?: {
    url: string | null;
    filename: string | null;
    uploadedAt: string | null;
  } | null;
  pendaftaranStatus: string;
}

export function SertifikatView({ sertifikat, pendaftaranStatus }: SertifikatViewProps) {
  const handleDownload = () => {
    if (sertifikat?.url) {
      window.open(sertifikat.url, '_blank');
    }
  };

  const isApproved = pendaftaranStatus === 'approved';
  const hasSertifikat = sertifikat?.url;

  return (
    <Card className="border-green-200/50 bg-gradient-to-br from-green-50/30 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Award className="h-5 w-5" />
          Sertifikat HKI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isApproved ? (
          <Alert className="border-amber-200 bg-amber-50/50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Sertifikat HKI akan tersedia setelah pendaftaran Anda disetujui oleh admin.
            </AlertDescription>
          </Alert>
        ) : hasSertifikat ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50/50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Selamat! Sertifikat HKI Anda telah tersedia dan dapat didownload.
              </AlertDescription>
            </Alert>

            <div className="bg-white/80 rounded-lg border border-green-200/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-slate-800">
                    {sertifikat.filename || "Sertifikat HKI.pdf"}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  PDF
                </Badge>
              </div>

              {sertifikat.uploadedAt && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Diterbitkan: {new Date(sertifikat.uploadedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <Button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Sertifikat HKI
              </Button>
            </div>
          </div>
        ) : (
          <Alert className="border-blue-200 bg-blue-50/50">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Pendaftaran Anda telah disetujui. Sertifikat HKI sedang diproses oleh admin dan akan segera tersedia.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
