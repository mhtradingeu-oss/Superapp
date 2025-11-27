import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import type { EventEnvelope } from "../../core/events/event-bus.js";
import { notificationService } from "../notification/notification.service.js";
import type {
  ActionConfig,
  ConditionConfig,
  CreateAutomationInput,
  UpdateAutomationInput,
  AutomationRuleRecord,
} from "./automation.types.js";

const ruleSelect = {
  id: true,
  brandId: true,
  name: true,
  description: true,
  triggerType: true,
  triggerEvent: true,
  triggerConfigJson: true,
  conditionConfigJson: true,
  actionsConfigJson: true,
  enabled: true,
  createdAt: true,
  updatedAt: true,
  lastRunAt: true,
  lastRunStatus: true,
} satisfies Prisma.AutomationRuleSelect;

class AutomationService {
  constructor(private readonly db = prisma) {}

  async list(params: { brandId?: string; page?: number; pageSize?: number } = {}) {
    const { brandId, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });
    const where: Prisma.AutomationRuleWhereInput = {};
    if (brandId) where.brandId = brandId;

    const [total, items] = await this.db.$transaction([
      this.db.automationRule.count({ where }),
      this.db.automationRule.findMany({ where, select: ruleSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: items.map((item) => this.mapRule(item)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<AutomationRuleRecord> {
    const rule = await this.db.automationRule.findUnique({ where: { id }, select: ruleSelect });
    if (!rule) throw notFound("Automation rule not found");
    return this.mapRule(rule);
  }

  async create(input: CreateAutomationInput): Promise<AutomationRuleRecord> {
    const created = await this.db.automationRule.create({
      data: {
        brandId: input.brandId ?? null,
        name: input.name,
        description: input.description ?? null,
        triggerType: input.triggerType,
        triggerEvent: input.triggerEvent ?? null,
        triggerConfigJson: input.triggerConfig ? JSON.stringify(input.triggerConfig) : null,
        conditionConfigJson: input.conditionConfig ? JSON.stringify(input.conditionConfig) : null,
        actionsConfigJson: input.actions ? JSON.stringify({ actions: input.actions }) : null,
        enabled: input.isActive ?? true,
        createdById: input.createdById ?? null,
      },
      select: ruleSelect,
    });
    return this.mapRule(created);
  }

  async update(id: string, input: UpdateAutomationInput): Promise<AutomationRuleRecord> {
    const existing = await this.db.automationRule.findUnique({ where: { id }, select: ruleSelect });
    if (!existing) throw notFound("Automation rule not found");

    const updated = await this.db.automationRule.update({
      where: { id },
      data: {
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        brandId: input.brandId ?? existing.brandId,
        triggerType: input.triggerType ?? (existing.triggerType as "event" | "schedule"),
        triggerEvent: input.triggerEvent ?? existing.triggerEvent,
        triggerConfigJson: input.triggerConfig ? JSON.stringify(input.triggerConfig) : existing.triggerConfigJson,
        conditionConfigJson: input.conditionConfig ? JSON.stringify(input.conditionConfig) : existing.conditionConfigJson,
        actionsConfigJson: input.actions ? JSON.stringify({ actions: input.actions }) : existing.actionsConfigJson,
        enabled: input.isActive ?? existing.enabled,
        updatedById: input.createdById ?? null,
      },
      select: ruleSelect,
    });
    return this.mapRule(updated);
  }

  async remove(id: string) {
    await this.db.automationRule.delete({ where: { id } });
    return { id };
  }

  async handleEvent(event: EventEnvelope) {
    const rules = await this.db.automationRule.findMany({
      where: {
        enabled: true,
        triggerType: "event",
        AND: [
          { OR: [{ triggerEvent: event.name }, { triggerEvent: null }] },
          { OR: [{ brandId: null }, { brandId: event.context?.brandId }] },
        ],
      },
      select: ruleSelect,
    });

    for (const rule of rules) {
      await this.executeRule(rule, event);
    }
  }

  async runScheduled(now: Date = new Date()) {
    const rules = await this.db.automationRule.findMany({
      where: { enabled: true, triggerType: "schedule" },
      select: ruleSelect,
    });

    for (const rule of rules) {
      const config = this.parseJson(rule.triggerConfigJson) ?? {};
      if (this.shouldRunNow(config, now)) {
        await this.executeRule(rule, undefined, now);
      }
    }
  }

  async runRule(ruleId: string) {
    const rule = await this.db.automationRule.findUnique({ where: { id: ruleId }, select: ruleSelect });
    if (!rule) throw notFound("Automation rule not found");
    await this.executeRule(rule, undefined, new Date());
  }

  private async executeRule(ruleRow: Prisma.AutomationRuleGetPayload<{ select: typeof ruleSelect }>, event?: EventEnvelope, now: Date = new Date()) {
    const rule = this.mapRule(ruleRow);
    if (!rule.isActive) return;
    const conditions = rule.conditionConfig ?? {};

    if (event && rule.triggerEvent && rule.triggerEvent !== event.name) return;
    if (event && rule.brandId && rule.brandId !== (event.context?.brandId ?? (event.payload as { brandId?: string })?.brandId)) return;
    if (!this.evaluateConditions(conditions, event?.payload)) return;

    try {
      await this.runActions(rule.actions, event);
      await this.db.automationExecutionLog.create({
        data: {
          ruleId: rule.id,
          status: "success",
          eventName: event?.name ?? null,
          resultJson: JSON.stringify({ message: "Actions executed" }),
        },
      });
      await this.db.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: now, lastRunStatus: "success" },
      });
    } catch (err) {
      console.error("[automation] action failed", err);
      await this.db.automationExecutionLog.create({
        data: {
          ruleId: rule.id,
          status: "failure",
          eventName: event?.name ?? null,
          errorMessage: err instanceof Error ? err.message : "Unknown automation error",
        },
      });
      await this.db.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: now, lastRunStatus: "failure" },
      });
    }
  }

  private evaluateConditions(conditionConfig: { all?: ConditionConfig[]; any?: ConditionConfig[] }, payload: unknown): boolean {
    const target = (payload ?? {}) as Record<string, unknown>;
    const evaluate = (condition: ConditionConfig) => {
      const value = this.resolvePath(target, condition.path);
      switch (condition.op) {
        case "eq":
          return value === condition.value;
        case "neq":
          return value !== condition.value;
        case "gt":
          return Number(value) > Number(condition.value);
        case "lt":
          return Number(value) < Number(condition.value);
        case "includes":
          return Array.isArray(value) ? value.includes(condition.value) : typeof value === "string" && typeof condition.value === "string"
            ? value.includes(condition.value)
            : false;
        default:
          return false;
      }
    };

    if (conditionConfig.all && conditionConfig.all.length) {
      const allMatch = conditionConfig.all.every((c) => evaluate(c));
      if (!allMatch) return false;
    }

    if (conditionConfig.any && conditionConfig.any.length) {
      return conditionConfig.any.some((c) => evaluate(c));
    }

    return true;
  }

  private async runActions(actions: ActionConfig[], event?: EventEnvelope) {
    for (const action of actions) {
      if (action.type === "notification") {
        await notificationService.createNotification({
          userId: action.params?.userId as string | undefined,
          brandId: (event?.context?.brandId as string | undefined) ?? (action.params?.brandId as string | undefined),
          type: (action.params?.type as string | undefined) ?? "automation",
          title: (action.params?.title as string | undefined) ?? "Automation triggered",
          message: (action.params?.message as string | undefined) ?? `Rule executed${event ? ` on ${event.name}` : ""}`,
          data: { event: event?.payload ?? null },
        });
      } else if (action.type === "log") {
        console.log("[automation log]", action.params ?? {}, event?.name);
      }
    }
  }

  private shouldRunNow(config: Record<string, unknown>, now: Date): boolean {
    const cadence = (config.cadence as string | undefined) ?? "daily";
    if (cadence === "hourly") return true;
    if (cadence === "daily") {
      const hour = now.getHours();
      const targetHour = typeof config.hour === "number" ? (config.hour as number) : 0;
      return hour === targetHour;
    }
    return false;
  }

  private resolvePath(target: Record<string, unknown>, path: string) {
    return path.split(".").reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, target);
  }

  private parseJson(value?: string | null) {
    if (!value) return undefined;
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }

  private mapRule(row: Prisma.AutomationRuleGetPayload<{ select: typeof ruleSelect }>): AutomationRuleRecord {
    const actionsWrapper = this.parseJson(row.actionsConfigJson);
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      brandId: row.brandId ?? undefined,
      triggerType: (row.triggerType as "event" | "schedule") ?? "event",
      triggerEvent: row.triggerEvent ?? undefined,
      triggerConfig: this.parseJson(row.triggerConfigJson),
      conditionConfig: this.parseJson(row.conditionConfigJson) as { all?: ConditionConfig[]; any?: ConditionConfig[] } | undefined,
      actions: (actionsWrapper?.actions as ActionConfig[]) ?? [],
      isActive: row.enabled ?? true,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lastRunAt: row.lastRunAt ?? undefined,
      lastRunStatus: row.lastRunStatus ?? undefined,
    };
  }
}

export const automationService = new AutomationService();
