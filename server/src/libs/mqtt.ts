import mqtt from "mqtt";
import { MotionEventRepository } from "./entities.repo";
import dotenv from "dotenv";

dotenv.config();

const client = mqtt.connect(`mqtt://${process.env.LOCAL_IP}:${process.env.MQTT_PORT}`);

client.on("connect", () => {
    client.subscribe(["home/+/motion", "home/register"], (error) => {
        if (error) {
            console.error("MQTT subscribe error:", error);
            return;
        }
        console.log("MQTT subscribed to MQTT topics");
    });
});

client.on("message", async (topic, message) => {
    try{
        const data = JSON.parse(message.toString());

        if (topic === "home/+/motion") {
            console.log("Motion Event Received", data);
            await MotionEventRepository.save({
                deviceId: data.deviceId,
                room: data.room,
                motion: data.motion,
                count: data.count,
                lightsOn: data.lightsOn,
                uptime: data.uptime,
            });
            return
        } else if (topic === "home/register") {
            console.log("Register Event Received", data);
            return
            // await MotionEventRepository.save({
            //     deviceId: data.deviceId,
            //     room: data.room,
            //     motion: data.motion,
            //     count: data.count,
            //     lightsOn: data.lightsOn,
            //     uptime: data.uptime,
            // });
        }

        
    } catch (error) {
        console.error("Error parsing message:", error);
    }
});

client.on("error", (error) => {
    console.error("MQTT error:", error);
});

export default client;