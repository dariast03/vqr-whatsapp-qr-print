import { type Handler } from 'aws-cdk-lib/aws-lambda';
import { Schema } from '../../data/resource';
import { ApiResponse } from '../../types/types';

export const handler: Schema['generateQrWhatsApp']['functionHandler'] = async (
  event,
  context
) => {
  const { file } = event.arguments;

  try {
    if (!file) {
      return buildResponse({
        success: false,
        statusCode: 400,
        message: 'Invalid request',
        error: {
          code: 'MissingFileParameter',
          details: "The 'file' field is required.",
        },
      });
    }

    const csvBuffer = Buffer.from(file, 'base64');

    const response = await fetch(
      'https://j4mgwp9gqh.execute-api.us-east-1.amazonaws.com/default/buildWhatsappQrPrintable',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvBuffer,
      }
    );

    if (!response.ok) {
      return buildResponse({
        success: false,
        statusCode: response.status,
        message: 'Failed to generate QR PDF',
        error: {
          code: 'ExternalServiceError',
          details: response.statusText,
        },
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const pdfBase64 = pdfBuffer.toString('base64');

    return buildResponse({
      success: true,
      statusCode: 200,
      message: 'PDF generated successfully',
      data: {
        pdfBase64,
      },
    });
  } catch (err: any) {
    return buildResponse({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      error: {
        code: 'UnexpectedError',
        details: err?.message || 'Unknown error occurred',
      },
    });
  }
};

function buildResponse<T>(res: ApiResponse<T>): string {
  return JSON.stringify(res);
}
