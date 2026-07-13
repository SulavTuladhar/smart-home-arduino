import { ApiError } from "./api.error";

export class InternalServerError extends ApiError {
    constructor(message = "Internal server error"){
        super(message, 500);
    }
}