import type { Response } from "express";

interface SuccessResponse<T>{
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
): Response<SuccessResponse<T>>{
    return response.status(statusCode).json({
        success: true,
        message,
        ...(data !== undefined ? { data } : {})
    });
}

export function sendError(
    response: Response,
    statusCode: number,
    message: string,
    details?: unknown
): Response<ErrorResponse>{
    return response.status(statusCode).json({
        success: false,
        message,
        ...(details !== undefined ? { details } : {})
    });
}