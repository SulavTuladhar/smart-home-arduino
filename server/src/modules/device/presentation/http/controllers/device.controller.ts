import { Request, Response } from "express";
import { DeviceService } from "../../../application/device.service";
import { Mapper } from "../../../../../shared/mapper/mapper";
import { DeviceMapper } from "../../../mappers/device.mapper";
import { sendError, sendSuccess } from "../../../../../shared/http/api.response";

export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService
    ){}

    getDevices = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const devices = await this.deviceService.getAllDevices();

        const responseObj = Mapper.mapList(devices, DeviceMapper.toSummary);

        sendSuccess(
            response,
            200,
            "Device retrieved successfully",
            responseObj
        );
    }

    getDevice = async (
        request: Request,
        response: Response
    ): Promise<void> => {
        const deviceId = request.params.deviceId as string;

        if(!deviceId){
            sendError(
                response,
                404,
                "Device Id is required"
            );
            return;
        }

        try{
            const device = await this.deviceService.getDeviceById(deviceId);

            const responseObj = Mapper.map(
                device,
                DeviceMapper.toDetails
            );

            sendSuccess(
                response,
                200,
                "Device retrived sucessfully",
                responseObj
            );
        } catch(error) {
            const message = error instanceof Error ? error.message : "Failed to retrived device";
            sendError(
                response,
                message.includes("not found") ? 404 : 500,
                message
            )
        }
    }
}