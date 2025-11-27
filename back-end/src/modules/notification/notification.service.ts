import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { buildPagination } from "../../core/utils/pagination.js";
import type { CreateNotificationInput, NotificationFilters, NotificationRecord } from "./notification.types.js";

class NotificationService {
  constructor(private readonly db = prisma) {}

  async createNotification(input: CreateNotificationInput): Promise<NotificationRecord> {
    const created = await this.db.notification.create({
      data: {
        brandId: input.brandId ?? null,
        userId: input.userId ?? null,
        type: input.type ?? null,
        channel: "in-app",
        title: input.title,
        body: input.message,
        status: input.status ?? "unread",
        metaJson: null,
        dataJson: input.data ? JSON.stringify(input.data) : null,
      },
    });

    return this.map(created);
  }

  async listForUser(userId: string, filters: NotificationFilters = {}): Promise<{ data: NotificationRecord[]; total: number; page: number; pageSize: number }> {
    const { status, brandId, type, page = 1, pageSize = 20 } = filters;
    const { skip, take } = buildPagination({ page, pageSize });

    const where: Prisma.NotificationWhereInput = {
      OR: [{ userId }, { userId: null }],
    };
    if (status) where.status = status;
    if (brandId) where.brandId = brandId;
    if (type) where.type = type;

    const [total, rows] = await this.db.$transaction([
      this.db.notification.count({ where }),
      this.db.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: rows.map((row) => this.map(row)),
      total,
      page,
      pageSize: take,
    };
  }

  async markRead(ids: string[], userId: string): Promise<void> {
    await this.db.notification.updateMany({
      where: { id: { in: ids }, OR: [{ userId }, { userId: null }] },
      data: { status: "read", readAt: new Date() },
    });
  }

  async markAllReadForUser(userId: string): Promise<void> {
    await this.db.notification.updateMany({
      where: { OR: [{ userId }, { userId: null }], status: { not: "read" } },
      data: { status: "read", readAt: new Date() },
    });
  }

  private map(row: Prisma.NotificationGetPayload<{}>): NotificationRecord {
    return {
      id: row.id,
      brandId: row.brandId ?? undefined,
      userId: row.userId ?? undefined,
      type: row.type ?? undefined,
      title: row.title,
      message: row.body,
      status: row.status ?? undefined,
      createdAt: row.createdAt,
      readAt: row.readAt ?? undefined,
      data: row.dataJson ? (JSON.parse(row.dataJson) as Record<string, unknown>) : undefined,
    };
  }
}

export const notificationService = new NotificationService();
