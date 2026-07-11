export interface RelaySyncConfiguration {
    gpio: number;
    enabled: boolean
}

export interface SetRelayStateBody{
    state: boolean;
}