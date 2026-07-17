import z from "zod";

export const registerRequestSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters.")
        .max(100, "Name must contain at most 100 characters."),

    email: z  
        .email("A valid email address is required.")
        .trim()
        .toLowerCase(),

    password: z 
        .string()
        .min(8, "Password must contain at least 8 characters.")
        .max(128, "Password must contain at most 128 characters.")
});

export const registerResponseSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email()
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;