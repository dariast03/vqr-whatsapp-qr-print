export interface ErrorDetail {
    code: string;
    details: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    error?: ErrorDetail;
}