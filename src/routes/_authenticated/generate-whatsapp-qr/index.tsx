import GenerateWhatsappQR from '@/features/generate-whatsapp-qr';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/generate-whatsapp-qr/')({
  component: GenerateWhatsappQR,
});
