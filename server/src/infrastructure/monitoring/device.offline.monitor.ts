import { DeviceService } from "../../modules/device/application/device.service";

export class DeviceOfflineMonitor{
    private readonly checkIntervalMs = 30_000;
    private readonly offlineThresHoldMs = 90_000;
    private timer?: NodeJS.Timeout;

    constructor(
        private readonly deviceService: DeviceService
    ){}

    start(): void {
        if(this.timer) return;

        console.info(`Starting  device offline monitor`);
        
        this.timer = setInterval(async() => {
            try{
                const count = await this.deviceService.markStaleDevicesOffline(this.offlineThresHoldMs);

                if(count > 0) console.info(`${count} device(s) marked offline`);

            } catch(error) {
                console.error("Device offline monitor failed: ", error instanceof Error ? error.message : error);
            }
        }, this.checkIntervalMs)
    }

    stop(): void {
        if(!this.timer) return;

        clearInterval(this.timer);

        this.timer = undefined;
        console.info("Device offline monitor stopped");
    }
}