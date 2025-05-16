'use client';

import type React from 'react';

import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import { amplifyClient } from '@/amplify/client';

export function QrGenerator() {
  const [files, setFiles] = useState<File[]>([]);

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate file type (only images)
      if (file.type !== 'text/csv') {
        return 'Solo se permiten archivos CSV';
      }

      // Validate file size (max 2MB)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        return `El tamaño del archivo debe ser menor que ${MAX_SIZE / (1024 * 1024)}MB`;
      }

      return null;
    },
    [files]
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" ha sido rechazado`,
    });
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(0);
    setPdfUrl(null);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 600);

    try {
      const response = await fetch(
        'https://j4mgwp9gqh.execute-api.us-east-1.amazonaws.com/default/buildWhatsappQrPrintable',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv',
          },
          body: file,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setProgress(100);

      toast.success('¡Éxito!', {
        description: 'Tu PDF ha sido generado correctamente.',
      });
    } catch (err) {
      clearInterval(progressInterval);
      setError(
        'Ocurrió un error al procesar tu archivo. Por favor, intenta de nuevo.'
      );

      toast.error('Error al generar PDF', {
        description:
          'Ocurrió un error al procesar tu archivo. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setCsvData([]);
    setPdfUrl(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const xd = await amplifyClient.queries.generateQrWhatsApp({
        file: base64,
      });
      console.log('🚀 ~ handleUpload ~ xd:', xd);
    }
  };

  return (
    <section id='upload-section' className='mb-16 scroll-mt-16'>
      <div className='mb-8 text-center'>
        <h2 className='mb-2 text-3xl font-bold tracking-tight'>
          Generador de QR
        </h2>
        <p className='text-muted-foreground'>
          Sube un archivo CSV y obtén un PDF con códigos QR de WhatsApp para
          imprimir
        </p>
      </div>

      <Button onClick={handleUpload}>TEST</Button>

      <Card className=' border-2 shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-primary' />
            Subir archivo CSV
          </CardTitle>
          <CardDescription>
            Arrastra y suelta tu archivo o haz clic para seleccionarlo. Máximo
            40 registros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxFiles={2}
            maxSize={5 * 1024 * 1024}
            className='w-full '
            value={files}
            onValueChange={setFiles}
            onFileReject={onFileReject}
            onFileValidate={onFileValidate}
            multiple
          >
            <FileUploadDropzone>
              <div className='flex flex-col items-center gap-1 text-center'>
                <div className='flex items-center justify-center rounded-full border p-2.5'>
                  <Upload className='size-6 text-muted-foreground' />
                </div>
                <p className='font-medium text-sm'>Drag & drop files here</p>
                <p className='text-muted-foreground text-xs'>
                  Or click to browse (max 2 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant='outline' size='sm' className='mt-2 w-fit'>
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button variant='ghost' size='icon' className='size-7'>
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>

          {csvData.length > 0 && (
            <div className='mb-6 overflow-hidden rounded-lg border'>
              {/* <DataTable data={csvData} /> */}
            </div>
          )}

          {isLoading && (
            <div className='mb-6 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Generando PDF...</span>
                <span className='text-sm font-medium'>{progress}%</span>
              </div>
              <Progress value={progress} className='h-2' />
            </div>
          )}

          {error && (
            <div className='mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950/50 dark:text-red-400'>
              <AlertCircle className='h-5 w-5' />
              <p>{error}</p>
            </div>
          )}

          {pdfUrl && (
            <div className='mb-6 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'>
              <CheckCircle className='h-5 w-5' />
              <p>¡Tu PDF ha sido generado exitosamente!</p>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex flex-col gap-4 sm:flex-row'>
          {pdfUrl ? (
            <>
              <Button
                className='w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto'
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                <Download className='mr-2 h-4 w-4' />
                Descargar PDF
              </Button>
              <Button
                variant='outline'
                className='w-full sm:w-auto'
                onClick={resetForm}
              >
                Generar otro PDF
              </Button>
            </>
          ) : (
            <>
              <Button
                className='w-full sm:w-auto'
                onClick={handleSubmit}
                disabled={!file || isLoading || !!error}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Procesando...
                  </>
                ) : (
                  'Generar PDF'
                )}
              </Button>
              {file && (
                <Button
                  variant='outline'
                  className='w-full sm:w-auto'
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
