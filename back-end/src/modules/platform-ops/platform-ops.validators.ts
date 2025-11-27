import { z } from "zod";
import { listActivityLogSchema } from "../activity-log/activity-log.validators.js";

export const listPlatformOpsErrorSchema = listActivityLogSchema;
export const listPlatformOpsAuditSchema = listActivityLogSchema;

export const listPlatformOpsJobsSchema = z.object({
  status: z.string().optional(),
});
