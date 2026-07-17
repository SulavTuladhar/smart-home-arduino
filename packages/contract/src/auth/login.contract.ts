import z from "zod";

export const loginRequestSchema = z.object({
        email: z   
            .email()
            .trim()
            .toLowerCase(),
        
        password: z 
            .string()
            .min(8)
            .max(128)
});

export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
