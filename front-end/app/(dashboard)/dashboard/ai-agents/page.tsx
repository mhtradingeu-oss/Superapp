"use client";

import { useEffect, useState } from "react";
import { listAgents, createAgent, deleteAgent, testAgent } from "@/lib/api/ai-brain";
import { listBrands } from "@/lib/api/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api/client";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { Textarea } from "@/components/ui/textarea";

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", osScope: "", brandId: "", configJson: "" });
  const [brands, setBrands] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ brandId?: string; scope?: string }>({});

  const load = async () => {
    try {
      setLoading(true);
      const [data, brandList] = await Promise.all([listAgents(filters), listBrands()]);
      setAgents(data?.data ?? []);
      setBrands(brandList?.data ?? []);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    try {
      const cfg = form.configJson ? JSON.parse(form.configJson) : undefined;
      await createAgent({ name: form.name, osScope: form.osScope, brandId: form.brandId || undefined, configJson: cfg });
      toast.success("Agent created");
      setForm({ name: "", osScope: "", brandId: "", configJson: "" });
      await load();
    } catch (err: any) {
      const isParseError = err instanceof SyntaxError;
      toast.error(isParseError ? "Config JSON is invalid" : apiErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete agent?")) return;
    try {
      await deleteAgent(id);
      toast.success("Deleted");
      await load();
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  const handleTest = async (id: string) => {
    try {
      await testAgent(id, { hello: "world" });
      toast.success("Tested agent");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  };

  return (
    <PermissionGuard required="ai:manage">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">AI Agents</h1>
          <p className="text-sm text-muted-foreground">
            Configure brand-scoped agents (pricing, marketing, CRM). JSON config accepts persona, tone, guardrails, and tools.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.brandId ?? ""}
            onChange={(e) => setFilters((p) => ({ ...p, brandId: e.target.value || undefined }))}
          >
            <option value="">All brands</option>
            {brands.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.scope ?? ""}
            onChange={(e) => setFilters((p) => ({ ...p, scope: e.target.value || undefined }))}
          >
            <option value="">All scopes</option>
            <option value="pricing">Pricing</option>
            <option value="crm">CRM</option>
            <option value="marketing">Marketing</option>
            <option value="inventory">Inventory</option>
            <option value="loyalty">Loyalty</option>
            <option value="assistant">Assistant</option>
          </select>
          <Button variant="outline" onClick={load} disabled={loading}>
            Apply
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Scope</Label>
            <Input value={form.osScope} onChange={(e) => setForm((p) => ({ ...p, osScope: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <select
              className="rounded-md border px-3 py-2 text-sm"
              value={form.brandId}
              onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))}
            >
              <option value="">Global</option>
              {brands.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Config JSON</Label>
            <Textarea
              value={form.configJson}
              onChange={(e) => setForm((p) => ({ ...p, configJson: e.target.value }))}
              placeholder='{"prompt":"...","temperature":0.2}'
              rows={4}
            />
          </div>
        </div>
        <Button onClick={submit} disabled={!form.name}>Create agent</Button>
        {loading ? (
          <Skeleton className="h-8 w-full" />
        ) : agents.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No agents yet. Create one to personalize AI behavior.</div>
        ) : (
          <div className="space-y-2">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between rounded border p-2 text-sm">
                <div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-muted-foreground">{agent.osScope ?? "-"}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleTest(agent.id)}>Test</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(agent.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}
