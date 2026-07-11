import type { MqttClient } from "mqtt";
import { RelayCommand } from "./mqtt.types";

export class MqttPublisher {
    constructor(
        private readonly mqttClient: MqttClient
    ){}

    async publishRelayCommand(
        room: string,
        command: RelayCommand
    ): Promise<void>{
        if(!this.mqttClient.connected){
            throw new Error("MQTTbroker is not connected");
        }
        const topic = `home/${room}/device/set`;

        const payload = JSON.stringify({
            command: "relay",
            channel: command.channel,
            state: command.state
        });

        await new Promise<void>((resolve, reject) => {
            this.mqttClient.publish(
                topic,
                payload,
                {
                    qos: 1,
                    retain: false
                },
                (error) => {
                    if(error){
                        reject(error);
                        return
                    }

                    resolve();
                }
            )
        });

        console.info(`Published relay command to ${topic}`);
    }
}