import z from "zod";

export const refreshTokenRequestSchema = z.object({
    refreshToken: z 
        .string()
        .min(1)
});

export  const refreshTokenResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;