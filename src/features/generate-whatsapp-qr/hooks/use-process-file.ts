import { useState } from 'react';
import { toast } from 'sonner';

import { amplifyClient } from '@/amplify/client';
import { GenerateQrWhatsappResponse, ProcessedFile } from '../schema/types';
import { fileToBase64 } from '../lib/base64';

export const useProcessFiles = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    const processedFile: ProcessedFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalFileId: file.name,
      name: file.name.replace('.csv', ''),
      extension: 'pdf',
      size: 'calculating',
      status: 'processing',
      progress: 0,
      pdfUrl: null,
      error: null,
    };

    setProcessedFiles((prev) => [...prev, processedFile]);

    const updateProcessedFile = (updates: Partial<ProcessedFile>) => {
      setProcessedFiles((prev) =>
        prev.map((pf) =>
          pf.id === processedFile.id ? { ...pf, ...updates } : pf
        )
      );
    };

    let progress = 0;
    const maxProgress = 80 + Math.floor(Math.random() * 15);
    const intervalTime = 300 + Math.random() * 400;

    const progressInterval = setInterval(() => {
      const increment = 3 + Math.floor(Math.random() * 5);
      progress = Math.min(progress + increment, maxProgress);
      updateProcessedFile({ progress });
      if (progress >= maxProgress) clearInterval(progressInterval);
    }, intervalTime);

    try {
      const base64 = await fileToBase64(file);
      const response = await amplifyClient.queries.generateQrWhatsApp({
        file: base64,
      });
      clearInterval(progressInterval);

      if (!response?.data)
        throw new Error('No se recibió respuesta del servidor');
      const pdfResponse = JSON.parse(
        response.data
      ) as GenerateQrWhatsappResponse;
      if (!pdfResponse.success)
        throw new Error('No se recibió PDF del servidor');

      const binaryString = atob(pdfResponse.data.pdfBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++)
        bytes[i] = binaryString.charCodeAt(i);
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      updateProcessedFile({
        status: 'completed',
        progress: 100,
        pdfUrl,
        size: `${(pdfBlob.size / 1024).toFixed(1)} KB`,
      });

      toast.success('¡Archivo procesado!', {
        description: `${file.name} ha sido procesado correctamente.`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      updateProcessedFile({
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Error desconocido',
        size: '0 KB',
      });
      toast.error('Error al procesar', {
        description: `No se pudo procesar ${file.name}`,
      });
    }
  };

  const processFiles = async (files: File[]) => {
    setProcessedFiles([]);
    setIsLoading(true);
    await Promise.allSettled(files.map(processFile));
    setIsLoading(false);
  };

  const removeFile = (fileId: string) => {
    setProcessedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return { processedFiles, isLoading, processFiles, removeFile };
};
