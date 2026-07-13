import { ApiError } from "../../errors/api.error"
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next): void => {
    if(error instanceof ApiError){
        response    
            .status(error.statusCode)
            .json({
                success: false,
                message: error.message,
                ...(error.details !== undefined
                    ? {details: error.details}
                    : {}
                )
            });
        return;
    }

    console.error("Unhandled application error");

    response.status(500).json({
        success: false,
        message: "Internal server error"
    });
}