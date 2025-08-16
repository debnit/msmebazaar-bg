import type { Request, Response } from "express";
import * as service from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const user = await service.register(req.body);
  res.status(201).json({ success: true, data: user });
};

export const login = async (req: Request, res: Response) => {
  const token = await service.login(req.body);
  res.json({ success: true, data: token });
};
