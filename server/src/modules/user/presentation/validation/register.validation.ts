import z from "zod";

export const registerSchema = z.object({
    name: z 
        .string()
        .min(2)
        .max(1000),
    email: z.email(),
    password: z 
        .string()
        .min(8)
        .max(1000)
}).strict();