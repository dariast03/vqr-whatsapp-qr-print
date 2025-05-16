import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { generateQrWhatsApp } from './functions/generate-qr-whatsapp/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  generateQrWhatsApp
});


// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      ['api-whatsapp-qr-printable']: {
        endpoint:
          'https://l3gps51tvb.execute-api.us-east-2.amazonaws.com/prod/',
        region: 'us-east-2',
      },
    },
  },
});
