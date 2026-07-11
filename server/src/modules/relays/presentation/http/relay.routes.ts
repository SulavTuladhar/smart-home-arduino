import { Router } from "express";
import { container } from "../../../../app/container";

export const relayRouter = Router();

const { setRelayState } = container.controllers.relayController;

relayRouter.post("/devices/:deviceId/relays/:channel/state", setRelayState);