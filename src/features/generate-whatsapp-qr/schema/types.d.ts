export interface ProcessedFile {
  id: string;
  originalFileId: string;
  name: string;
  extension: string;
  size: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  pdfUrl: string | null;
  error: string | null;
}

export type GenerateQrWhatsappResponseSuccess = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    pdfBase64: string;
  };
};

export type GenerateQrWhatsappResponseError = {
  success: false;
  statusCode: number;
  message: string;
  error: {
    code: string;
    details: string;
  };
};

export type GenerateQrWhatsappResponse =
  | GenerateQrWhatsappResponseSuccess
  | GenerateQrWhatsappResponseError;
