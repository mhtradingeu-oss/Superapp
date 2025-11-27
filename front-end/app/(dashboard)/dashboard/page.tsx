"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line as RechartLine,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Sparkles, Bell, Cpu, TrendingUp, Zap, Shield, HeartPulse, ShoppingBag } from "lucide-react";

const shortcuts = [
  { title: "Users", href: "/dashboard/users", description: "Manage team members" },
  { title: "Brands", href: "/dashboard/brands", description: "Brand metadata & settings" },
  { title: "Products", href: "/dashboard/products", description: "Manage catalog" },
  { title: "Pricing", href: "/dashboard/pricing", description: "Pricing, drafts, competitors" },
  { title: "Notifications", href: "/dashboard/notifications", description: "Ops inbox and alerts" },
  { title: "Automations", href: "/dashboard/automations", description: "Rules and workflows" },
];

const kpiCards = [
  { title: "Revenue", value: "€1.2M", trend: "+8.2% MoM", icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
  { title: "Pricing delta", value: "+3.4%", trend: "vs. baseline", icon: <Zap className="h-4 w-4 text-amber-500" /> },
  { title: "Inventory risk", value: "Low", trend: "4 SKUs flagged", icon: <Shield className="h-4 w-4 text-sky-500" /> },
  { title: "CRM conversions", value: "21%", trend: "+2.1% WoW", icon: <HeartPulse className="h-4 w-4 text-rose-500" /> },
  { title: "Marketing ROI", value: "3.4x", trend: "last 30 days", icon: <Sparkles className="h-4 w-4 text-indigo-500" /> },
  { title: "Loyalty uplift", value: "+12%", trend: "HAIROTICMEN", icon: <ShoppingBag className="h-4 w-4 text-fuchsia-500" /> },
];

const revenueSeries = [
  { name: "Jan", value: 950 },
  { name: "Feb", value: 1030 },
  { name: "Mar", value: 1080 },
  { name: "Apr", value: 1170 },
  { name: "May", value: 1250 },
  { name: "Jun", value: 1340 },
];

const pricingSeries = [
  { name: "Week 1", change: 1.2 },
  { name: "Week 2", change: 0.8 },
  { name: "Week 3", change: -0.4 },
  { name: "Week 4", change: 2.1 },
];

export default function DashboardHome() {
  const [aiPrompt, setAiPrompt] = useState("Summarize performance for HAIROTICMEN and highlight risk.");
  const [aiNarrative, setAiNarrative] = useState("AI is ready to generate a tailored narrative for your brand.");
  const breadcrumbs = useMemo(() => ["Home", "Dashboard"], []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{breadcrumbs.join(" / ")}</p>
            <h1 className="text-2xl font-semibold">MH-OS Command</h1>
            <p className="text-sm text-muted-foreground">Unified intelligence for brands, pricing, and AI.</p>
          </div>
          <div className="flex items-center gap-3">
            <Input placeholder="Search MH-OS" className="h-10 w-72" />
            <Button variant="ghost" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Badge variant="outline">Live</Badge>
            <Badge variant="secondary">HAIROTICMEN</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Role: Platform Admin</span>
          <InfoTooltip content="RBAC enforced across MH-OS modules; badges reflect your current persona." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm bg-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <InfoTooltip content="Pulls from live KPIs (finance, pricing, CRM) once the KPI service is wired." />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-semibold">{kpi.value}</div>
              <p className="flex items-center gap-2 text-xs text-emerald-600">
                {kpi.icon ?? <TrendingUp className="h-4 w-4" />}
                <span>{kpi.trend}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
              <InfoTooltip content="Recharts line view of revenue series provided by KPI summary API." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={revenueSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <RechartLine type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
                </RechartLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm space-y-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Pricing delta
              <InfoTooltip content="Average pricing change week over week; wire to pricing history endpoint for live data." />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricingSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="change" fill="#16a34a" />
              </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    Go
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              AI Narrative
              <InfoTooltip content="Connects to the assistant endpoint; customise the prompt per brand." />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              className="w-full rounded-lg border border-border bg-background p-3 text-sm shadow-inner focus:border-primary"
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={() => setAiNarrative(`(Placeholder) AI narrative for: ${aiPrompt}`)}>
                <Cpu className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(aiNarrative)}>
                Copy narrative
              </Button>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 p-3 text-sm leading-relaxed">{aiNarrative}</div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Brand Signals
              <InfoTooltip content="Live brand health signals; HAIROTICMEN data seeded." />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Top product</span>
              <Badge variant="outline">HAIROTICMEN serum</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI insights</span>
              <span className="text-muted-foreground">24 new</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pricing drafts</span>
              <span className="text-muted-foreground">6 pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Inventory watch</span>
              <span className="text-amber-600">4 low-stock SKUs</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
