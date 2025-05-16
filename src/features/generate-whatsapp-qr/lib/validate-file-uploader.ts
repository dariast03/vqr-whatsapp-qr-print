import { toast } from 'sonner';

const MAX_CSV_SIZE = 2 * 1024 * 1024; // 2MB

export function validateCsvFile(file: File): string | null {
  if (file.type !== 'text/csv') {
    return 'Solo se permiten archivos CSV';
  }
  if (file.size > MAX_CSV_SIZE) {
    return `El tamaño del archivo debe ser menor que ${MAX_CSV_SIZE / (1024 * 1024)}MB`;
  }
  return null;
}

export function showFileRejectedToast(file: File, message: string) {
  toast(message, {
    description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" ha sido rechazado`,
  });
}
