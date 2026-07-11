import { Router } from "express";
import { ApplicationContainer } from "../../../../app/application.container";

const container = new ApplicationContainer();
 
export const relayRouter = Router();

const { setRelayState } = container.controllers.relayController;

relayRouter.post("/devices/:deviceId/relays/:channel/state", setRelayState);