'use client';

import {
  Download,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProcessedFile } from '../schema/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProcessedFileListProps {
  files: ProcessedFile[];
  onRemoveFile?: (fileId: string) => void;
}

export function ProcessedFileList({
  files,
  onRemoveFile,
}: ProcessedFileListProps) {
  if (files.length === 0) {
    return (
      <p className='text-center text-muted-foreground'>
        No hay archivos procesados
      </p>
    );
  }

  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'pending':
        return <FileText className='h-5 w-5 text-zinc-500' />;
      case 'processing':
        return <Loader2 className='h-5 w-5 animate-spin text-amber-500' />;
      case 'completed':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-file-earmark-pdf-fill'
            viewBox='0 0 16 16'
          >
            <path d='M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z' />
            <path
              fillRule='evenodd'
              d='M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103'
            />
          </svg>
        );
      case 'error':
        return <AlertCircle className='h-5 w-5 text-red-500' />;
    }
  };

  const getStatusColor = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-zinc-50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400';
      case 'processing':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400';
      case 'completed':
        return 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400';
      case 'error':
        return 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400';
    }
  };

  const getStatusText = (file: ProcessedFile) => {
    switch (file.status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return `Procesando`;
      case 'completed':
        return 'Completado';
      case 'error':
        return file.error || 'Error';
    }
  };

  return (
    <div className='space-y-3'>
      {files.map((file) => (
        <div
          key={file.id}
          className='rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusColor(file.status)}`}
              >
                {getStatusIcon(file.status)}
              </div>
              <div>
                <p className='font-medium'>{file.name}</p>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  {file.size === 'calculating' ? (
                    <Skeleton className='h-4 w-16' />
                  ) : (
                    <>
                      {file.status === 'completed' ? (
                        <span>{file.size}</span>
                      ) : (
                        <span className='text-red-400'>{file.error}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              {file.status === 'completed' && file.pdfUrl && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => window.open(file.pdfUrl!, '_blank')}
                    className='h-8 w-8 rounded-full p-0'
                    title='Ver PDF'
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = file.pdfUrl!;
                      a.download = `${file.name}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className='h-8 w-8 rounded-full p-0 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50'
                    title='Descargar PDF'
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                </>
              )}

              {file.status === 'error' && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onRemoveFile?.(file.id)}
                    className='h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50'
                    title='Eliminar archivo'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </>
              )}
            </div>
          </div>

          {file.status === 'processing' && (
            <div className='mt-2 space-y-1'>
              <div className='flex items-center justify-between text-xs'>
                <span>{getStatusText(file)}</span>
                <span>{file.progress}%</span>
              </div>
              <Progress value={file.progress} className='h-1.5' />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
