"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPricing, listLogs, updatePricing } from "@/lib/api/pricing";
import { suggestPricing } from "@/lib/api/ai";
import { getProduct } from "@/lib/api/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { apiErrorMessage } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PermissionGuard } from "@/components/layout/permission-guard";
import { useState } from "react";

const schema = z.object({
  b2cNet: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  b2cGross: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  dealerNet: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
  vatPct: z.preprocess((val) => (val === "" ? undefined : Number(val)), z.number().optional()),
});

export default function PricingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["pricing", id], queryFn: () => getPricing(id), enabled: Boolean(id) });
  const logsQuery = useQuery({
    queryKey: ["pricing-logs-preview", data?.productId],
    queryFn: () => listLogs(data?.productId ?? ""),
    enabled: Boolean(data?.productId),
  });
  const productQuery = useQuery({
    queryKey: ["product", data?.productId],
    queryFn: () => getProduct(data?.productId ?? ""),
    enabled: Boolean(data?.productId),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      b2cNet: undefined,
      b2cGross: undefined,
      dealerNet: undefined,
      vatPct: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        b2cNet: data.b2cNet ?? undefined,
        b2cGross: data.b2cGross ?? undefined,
        dealerNet: data.dealerNet ?? undefined,
        vatPct: data.vatPct ?? undefined,
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (payload: z.infer<typeof schema>) => updatePricing(id, payload),
    onSuccess: () => {
      toast.success("Pricing updated");
      void queryClient.invalidateQueries({ queryKey: ["pricing", id] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  const fetchAI = async () => {
    if (!data) return;
    try {
      setAiLoading(true);
      const suggestion = await suggestPricing(data.productId);
      setAiSuggestion(suggestion);
      toast.success("AI suggestion ready");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard required={["pricing:read"]}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">
              Pricing for {productQuery.data?.name ?? data.productId}
            </h1>
            <p className="text-sm text-muted-foreground">
              Brand: {data.brandId ?? "N/A"} {productQuery.isLoading && <Spinner className="ml-2 inline-block h-4 w-4 align-middle" />}
            </p>
            <p className="text-xs text-muted-foreground">
              AI follows brand guardrails and keeps margins healthy. Update prices with care—changes are logged automatically.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${data.productId}/pricing/logs`)}>
              View logs
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${data.productId}/pricing/drafts`)}>
              Manage drafts
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${data.productId}/pricing/competitors`)}>
              Competitors
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/pricing")}>Back</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
            <CardTitle>Current Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>B2C Net: {data.b2cNet ?? "-"}</div>
            <div>B2C Gross: {data.b2cGross ?? "-"}</div>
            <div>Dealer Net: {data.dealerNet ?? "-"}</div>
            <div>VAT %: {data.vatPct ?? "-"}</div>
            <div>Updated: {new Date(data.updatedAt).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Suggested Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Spinner className="h-4 w-4" />
                  Generating suggestion...
                </div>
              ) : aiSuggestion ? (
                <>
                  <div className="font-semibold text-base">Suggested: {aiSuggestion.suggestedPrice ?? "-"}</div>
                  <div className="text-muted-foreground">{aiSuggestion.reasoning}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-1">Risk: {aiSuggestion.riskLevel}</span>
                    {aiSuggestion.confidenceScore ? <span className="rounded-full bg-muted px-2 py-1">Confidence: {aiSuggestion.confidenceScore}</span> : null}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">
                  No suggestion yet. AI will factor brand tone, VAT, and competitor signals when generating a price.
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={fetchAI} disabled={aiLoading || !hasPermission("ai:pricing")}>
                  {aiLoading ? "Generating..." : "Generate AI suggestion"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                  onClick={() => router.push(`/dashboard/products/${data.productId}/pricing/logs`)}
                >
                  View AI logs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <div className="space-y-2">
                <Label title="Net retail price before VAT">B2C Net</Label>
                <Input type="number" step="0.01" {...form.register("b2cNet")} />
              </div>
              <div className="space-y-2">
                <Label title="Gross retail price with VAT">B2C Gross</Label>
                <Input type="number" step="0.01" {...form.register("b2cGross")} />
              </div>
              <div className="space-y-2">
                <Label title="Wholesale / dealer net">Dealer Net</Label>
                <Input type="number" step="0.01" {...form.register("dealerNet")} />
              </div>
              <div className="space-y-2">
                <Label title="Tax percentage to apply on gross">VAT %</Label>
                <Input type="number" step="0.01" {...form.register("vatPct")} />
              </div>
              {hasPermission("pricing:update") && (
                <div className="md:col-span-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {logsQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" /> Loading logs...
              </div>
            ) : logsQuery.data && logsQuery.data.length > 0 ? (
              <div className="space-y-2 text-sm">
                {logsQuery.data.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div>
                      <div className="font-medium">{log.summary ?? "Log entry"}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.channel ?? "base"} — {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Δ {log.newNet ?? "-"} </div>
                  </div>
                ))}
                <Link className="text-primary text-sm" href={`/dashboard/products/${data.productId}/pricing/logs`}>
                  View all logs
                </Link>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No logs yet. Generate an AI suggestion or save a pricing change to start the audit trail.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
