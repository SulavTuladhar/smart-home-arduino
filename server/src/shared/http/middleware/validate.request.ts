import { NextFunction, Request, Response } from "express";
import { type ZodType } from "zod";
import { ValidationError } from "../../errors/validation.error";
import { formatValidationErrors } from "../validation/validation.error.formatter";

interface ValidationSchemas { 
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export function validateRequest(schemas: ValidationSchemas){
    return (
        request: Request,
        response: Response,
        next: NextFunction
    ): void => {
        try{
            if(schemas.params){
                const result = schemas.params.safeParse(request.params);
    
                if(!result.success){
                    throw new ValidationError(formatValidationErrors(result.error), "Invalid route parameters");
                }
    
                request.params = result.data as Request["params"];
            }
    
            if(schemas.query){
                const result = schemas.query.safeParse(request.query);
    
                if(!result.success){
                    throw new ValidationError(formatValidationErrors(result.error), "Invalid query parameters");
                }
    
                request.query = result.data as Request["query"];
            }
    
            if(schemas.body){
                const result = schemas.body.safeParse(request.body);
    
                if(!result.success){
                    throw new ValidationError(formatValidationErrors(result.error), "Invalid request body");
                }
    
                request.body = result.data;
            }
    
            next();
        } catch(error){
            next(error); 
        }
    }
}