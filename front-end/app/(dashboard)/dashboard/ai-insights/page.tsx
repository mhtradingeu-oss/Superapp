"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAiInsights } from "@/lib/api/ai";
import { apiErrorMessage } from "@/lib/api/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { PermissionGuard } from "@/components/layout/permission-guard";

interface InsightPayload {
  pricingHealth: string;
  marketingSummary: string;
  inventoryRisk: string;
  nextActions: string[];
}

export default function AIInsightsPage() {
  const [data, setData] = useState<InsightPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAiInsights({ brandName: user?.email ?? "Brand", highlights: "pricing, marketing, inventory" });
      setData(res as InsightPayload);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <PermissionGuard required="ai:insights">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">AI Insights</h1>
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Regenerate"}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard title="Pricing Health" loading={loading} body={data?.pricingHealth} />
          <InsightCard title="Marketing Summary" loading={loading} body={data?.marketingSummary} />
          <InsightCard title="Inventory Risk" loading={loading} body={data?.inventoryRisk} />
          <Card>
            <CardHeader>
              <CardTitle>Next Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-6 w-3/4" />
              ) : data?.nextActions?.length ? (
                <ul className="list-disc space-y-1 pl-4 text-sm">
                  {data.nextActions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No actions provided.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  );
}

function InsightCard({ title, body, loading }: { title: string; body?: string; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-6 w-3/4" /> : <p className="text-sm text-muted-foreground">{body ?? "No data"}</p>}
      </CardContent>
    </Card>
  );
}
