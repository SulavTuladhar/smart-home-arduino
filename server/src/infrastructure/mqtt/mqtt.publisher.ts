import { mqttClient } from "./mqtt.client";
import { RelayCommand } from "./mqtt.types";

export class MqttPublisher {
    async publishRelayCommand(
        room: string,
        command: RelayCommand
    ): Promise<void>{
        const topic = `home/${room}/device/set`;

        const payload = JSON.stringify({
            command: "relay",
            channel: command.channel,
            state: command.state
        });

        await new Promise<void>((resolve, reject) => {
            mqttClient.publish(
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