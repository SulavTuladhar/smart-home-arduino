import { AppDataSource } from "../data-source";
import { MotionEvent } from "../entities/MotionEvent";

export const MotionEventRepository = AppDataSource.getRepository(MotionEvent);