import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.status(200).json({ message: "motion received" });
});

export default router;
