import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { generateQrWhatsApp } from '../functions/generate-qr-whatsapp/resource';

const schema = a.schema({
  generateQrWhatsApp: a.query()
    .arguments({
      file: a.string().required(),
    })
    .returns(a.string())
    .authorization((allow) => [
      allow.publicApiKey(),
    ]).handler(a.handler.function(generateQrWhatsApp)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});