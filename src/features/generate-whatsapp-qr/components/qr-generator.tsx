'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { ProcessedFileList } from './processed-files';
import { useProcessFiles } from '../hooks/use-process-file';
import {
  showFileRejectedToast,
  validateCsvFile,
} from '../lib/validate-file-uploader';

export function QrGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const { processedFiles, isLoading, processFiles, removeFile } =
    useProcessFiles();

  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    setFiles([]);
    await processFiles(files);
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

      <Card className=' border-2 shadow-lg max-w-7xl mx-auto'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-primary' />
            Subir archivo CSV
          </CardTitle>
          <CardDescription>
            Arrastra y suelta tu archivo o haz clic para seleccionarlo. Máximo
            40 registros en el archivo csv.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            maxSize={5 * 1024 * 1024}
            className='w-full '
            value={files}
            onValueChange={setFiles}
            onFileReject={showFileRejectedToast}
            onFileValidate={validateCsvFile}
            multiple
          >
            <FileUploadDropzone>
              <div className='flex flex-col items-center gap-1 text-center'>
                <div className='flex items-center justify-center rounded-full border p-2.5'>
                  <Upload className='size-6 text-muted-foreground' />
                </div>
                <p className='font-medium text-sm'>
                  Arrastra y suelta los archivos aquí
                </p>
                <p className='text-muted-foreground text-xs'>
                  O haz clic para buscar archivos
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant='outline' size='sm' className='mt-2 w-fit'>
                  Buscar archivos
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
        </CardContent>

        <CardFooter className='flex flex-col gap-4 sm:flex-row'>
          <>
            <Button
              className='w-full sm:w-auto ml-auto'
              onClick={handleProcessFiles}
              disabled={!files.length || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Procesando...
                </>
              ) : (
                "Generar QR's WhatsApp"
              )}
            </Button>
          </>
        </CardFooter>

        <CardContent>
          {processedFiles.length > 0 && (
            <div className='mb-6'>
              <h3 className='mb-3 font-medium'>Archivos procesados</h3>
              <ProcessedFileList
                files={processedFiles}
                onRemoveFile={removeFile}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
