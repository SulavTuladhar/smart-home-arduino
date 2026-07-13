import { Request, Response } from "express";
import { sendSuccess } from "../../../../../shared/http/response/api.response";
import { Mapper } from "../../../../../shared/mapper/mapper";
import { DeviceService } from "../../../application/device.service";
import { DeviceMapper } from "../../../mappers/device.mapper";

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
            const device = await this.deviceService.getDeviceById(request.params.deviceId as string);

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
    }
}