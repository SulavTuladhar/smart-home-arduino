import { flattenError, ZodError } from "zod";

export interface ValidationErrorResponse{
    message: string;
    errors: Record<string, string[]>;
}

export function formatValidationError(
    error: ZodError
): ValidationErrorResponse {
    const flattened = flattenError(error);

    return {
        message: "Validation Failed",
        errors: flattened.fieldErrors
    }
}