import { defineFunction, secret } from '@aws-amplify/backend';

export const generateQrWhatsApp = defineFunction({
    name: 'generate-qr-whatsapp',
    entry: './handler.ts',
    timeoutSeconds: 30,
    environment: {

    }
});