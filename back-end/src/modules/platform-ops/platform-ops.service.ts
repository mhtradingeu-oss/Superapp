import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { activityLogService } from "../activity-log/activity-log.service.js";
import type {
  PlatformOpsAuditFilters,
  PlatformOpsAuditResponse,
  PlatformOpsErrorFilters,
  PlatformOpsErrorRecord,
  PlatformOpsHealthResponse,
  PlatformOpsJobRecord,
  PlatformOpsJobsResponse,
  PlatformOpsSecurityResponse,
  PlatformOpsUserRecord,
} from "./platform-ops.types.js";

class PlatformOpsService {
  constructor(private readonly db = prisma) {}

  async getHealth(): Promise<PlatformOpsHealthResponse> {
    const checkedAt = new Date().toISOString();
    const dbStart = Date.now();
    await this.db.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - dbStart;

    return {
      api: {
        status: "ok",
        checkedAt,
        info: process.env.NODE_ENV === "production" ? "Production API" : "Development API",
      },
      db: {
        status: "connected",
        latencyMs,
      },
      queues: [
        { name: "Default queue", status: "OK", note: "Workers responsive" },
        { name: "Pricing autos", status: "Stubbed", note: "Queue instrumented in Phase 5" },
      ],
    };
  }

  async listErrors(filters: PlatformOpsErrorFilters): Promise<{ data: PlatformOpsErrorRecord[]; total: number; page: number; pageSize: number }> {
    const result = await activityLogService.list({
      module: filters.module,
      type: filters.type,
      severity: filters.severity,
      from: filters.from,
      to: filters.to,
      page: filters.page,
      pageSize: filters.pageSize,
    });

    return {
      data: result.data.map((record) => {
        const message = this.extractMessage(record.meta) ?? record.type;
        return {
        id: record.id,
        module: record.module,
        type: record.type,
        severity: record.severity,
        source: record.source,
        message,
        meta: record.meta,
        createdAt: record.createdAt,
        };
      }),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  async listJobs(status?: string): Promise<PlatformOpsJobsResponse> {
    const where: Prisma.ScheduledJobWhereInput = {};
    if (status) where.status = status;
    const jobs = await this.db.scheduledJob.findMany({
      where,
      orderBy: { lastRunAt: "desc" },
      take: 10,
    });

    const lastBackup =
      jobs.find((job) => job.name.toLowerCase().includes("backup"))?.lastRunAt ?? jobs[0]?.lastRunAt ?? null;
    const upcomingWindow = jobs.find((job) => job.nextRunAt)?.nextRunAt ?? null;

    return {
      policy: "Daily backups + hourly automations",
      lastBackupAt: lastBackup,
      upcomingWindow,
      jobs: jobs.map((job) => ({
        id: job.id,
        name: job.name,
        status: job.status,
        lastRunAt: job.lastRunAt,
        nextRunAt: job.nextRunAt,
        cronExpression: job.cronExpression,
      })),
    };
  }

  async listSecurity(): Promise<PlatformOpsSecurityResponse> {
    const users = await this.db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 50,
    });

    const roles: Record<string, number> = {};
    users.forEach((user) => {
      const key = user.role ?? "UNASSIGNED";
      roles[key] = (roles[key] ?? 0) + 1;
    });

    const adminCount = users.filter((user) => user.role === "SUPER_ADMIN" || user.role === "ADMIN").length;

    return {
      totalUsers: users.length,
      adminCount,
      roles,
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };
  }

  async listAudit(filters: PlatformOpsAuditFilters): Promise<PlatformOpsAuditResponse> {
    const result = await activityLogService.list({
      brandId: filters.brandId,
      module: filters.module,
      userId: filters.userId,
      type: filters.type,
      severity: filters.severity,
      from: filters.from,
      to: filters.to,
      page: filters.page,
      pageSize: filters.pageSize,
    });

    return {
      data: result.data.map((record) => ({
        id: record.id,
        brandId: record.brandId,
        userId: record.userId,
        module: record.module,
        type: record.type,
        severity: record.severity,
        source: record.source,
        meta: record.meta,
        createdAt: record.createdAt,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  private extractMessage(meta?: Record<string, unknown>) {
    if (!meta) return undefined;
    const payload = meta.payload;
    if (typeof payload === "object" && payload !== null && "message" in payload) {
      const candidate = (payload as Record<string, unknown>).message;
      if (typeof candidate === "string") return candidate;
    }
    return undefined;
  }
}

export const platformOpsService = new PlatformOpsService();
