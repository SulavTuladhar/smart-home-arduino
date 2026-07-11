import { Router } from "express";
import { container } from "../../container";

export const relayRouter = Router();

const { setRelayState } = container.controllers.relayController;

relayRouter.post("/devices/:deviceId/relays/:channel/state", setRelayState);