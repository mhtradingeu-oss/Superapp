import type { NextFunction, Request, Response } from "express";
import { virtualOfficeService } from "./virtual-office.service.js";

export async function startMeeting(req: Request, res: Response, next: NextFunction) {
  try {
    const meeting = await virtualOfficeService.runMeeting(req.body);
    res.json(meeting);
  } catch (err) {
    next(err);
  }
}

export async function listDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(virtualOfficeService.listDepartments());
  } catch (err) {
    next(err);
  }
}
