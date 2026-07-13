import z, { set } from "zod";

export const RelayParamsSchema = z.object({
    deviceId: z
        .string()   
        .trim()
        .min(1, "Device Id is required"),
    channel: z
        .coerce
        .number()
        .int()
        .positive("Channel must be a positive integer"),
});

export const setRelayStateBodySchema = z.object({
    state: z
        .boolean()
}).strict();

export const updateRelayBodySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Relay name cannot exceed 100 characters")
        .max(100, "Relay name cannot exceed 100 characters")
        .optional(),
    enable: z
        .boolean()
        .optional()
})
    .strict()
    .refine(body => 
        body.name !== undefined || 
        body.enable !== undefined, 
        {
            message: "At least one of name or eenabled is required"
        }
);

export type RelayParams = z.infer<typeof RelayParamsSchema>;

export type SetRelayStateBody = z.infer<typeof setRelayStateBodySchema>;

export type UpdateRelayBody = z.infer<typeof updateRelayBodySchema>;