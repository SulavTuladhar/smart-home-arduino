import { SetRelayStateBody } from "./relay.types";

export function isSetRelayStateBody(
    value: unknown
): value is SetRelayStateBody{
    if(typeof value !== "object" || value === null) return false;

    const body = value as Record<string, unknown>;
    return typeof body.state === "boolean";
}
