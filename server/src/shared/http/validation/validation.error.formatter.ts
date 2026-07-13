import { ZodError } from "zod";

export function formatValidationErrors(error: ZodError): Record<string, string[]>{
    const errors: Record<string, string[]> = {};

    for (const issue of error.issues){
        const field = issue.path.length > 0
            ? issue.path.join(".")
            : "request";
        
        if(!errors[field]){
            errors[field] = [];
        }
        errors[field].push(issue.message);
    }
    return errors;
}