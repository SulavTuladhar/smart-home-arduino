import { NextFunction, Request, Response } from "express";
import { flattenError, type ZodType } from "zod";
import { sendError } from "../utils/api.response";

interface ValidationSchemas { 
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export function validateSchema(schemas: ValidationSchemas){
    return (
        request: Request,
        response: Response,
        next: NextFunction
    ): void => {
        if(schemas.params){
            const result = schemas.params.safeParse(request.params);

            if(!result.success){
                sendError(
                    response,
                    400,
                    "Invalid route parameters",
                    flattenError(result.error)
                );
                return
            }

            request.params = result.data as Request["params"];
        }

        if(schemas.query){
            const result = schemas.query.safeParse(request.query);

            if(!result.success){
                sendError(
                    response,
                    400,
                    "Invalid query paramters",
                    flattenError(result.error)
                );
                return;
            }

            request.query = result.data as Request["query"];
        }

        if(schemas.body){
            const result = schemas.body.safeParse(request.body);

            if(!result.success){
                sendError(
                    response,
                    400,
                    "Invalid request body",
                    flattenError(result.error)
                );
                return;
            }

            request.body = result.data;
        }

        next();
    }
}