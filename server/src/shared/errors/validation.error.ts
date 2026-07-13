import { ApiError } from "./api.error";

export class ValidationError extends ApiError {
    constructor(
        public readonly errors: Record<string, string[]>,
        message = "Validation Failed"
    ){
        super(message, 400, {
            errors
        });
    }   
}