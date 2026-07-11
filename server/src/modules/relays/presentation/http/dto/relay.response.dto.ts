export interface RelayResponseDto {
    channel: number;
    name: string;
    enabled: boolean;
    desiredState: boolean;
    actuablState: boolean;
}