import type { Response } from "express";

interface ApiSuccessResponse<T>{
    success: true;
    message: string;
    data?: T;
}

interface ErrorResponse {
    success: false;
    message: string;
    details?: unknown;
}

export function sendSuccess<T>(
    response: Response,
    statusCode: number,
    message: string,
    data?: T
): Response<ApiSuccessResponse<T>>{
    return response
        .status(statusCode)
        .json({
        success: true,
        message,
        ...(data !== undefined ? { data } : {})
    });
}