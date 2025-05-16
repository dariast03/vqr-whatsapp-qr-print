import { type Handler } from 'aws-cdk-lib/aws-lambda';

const CONFIG = {};

export const handler: Handler = async (event: any, context: any) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Amplify Function!',
            event,
            context,
            config: CONFIG,
        }),
    };
};
