/**
 * DashboardShell is the persistent layout for the admin, handling navigation + top bar.
 * Keep the API light: it only expects children. Navigation items live locally to match RBAC.
 */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./notification-bell";
import { GlobalSearch } from "./global-search";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Tag,
  Bot,
  Lightbulb,
  FileText,
  Settings2,
  Bell,
  ActivitySquare,
  Workflow,
  Contact2,
  Megaphone,
  HeartHandshake,
  LineChart,
  Briefcase,
  Activity,
  AlertCircle,
  ShieldCheck,
  Database,
  FileSearch,
  Store,
  Users2,
} from "lucide-react";

type NavItem = { href: string; label: string; permission?: string | string[]; icon: ReactNode };

const coreNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", permission: undefined, icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/dashboard/users", label: "Users", permission: "users:read", icon: <Users className="h-4 w-4" /> },
  { href: "/dashboard/brands", label: "Brands", permission: "brand:read", icon: <Building2 className="h-4 w-4" /> },
  { href: "/dashboard/products", label: "Products", permission: "product:read", icon: <Package className="h-4 w-4" /> },
  { href: "/dashboard/pricing", label: "Pricing", permission: "pricing:read", icon: <Tag className="h-4 w-4" /> },
];

const aiNavItems: NavItem[] = [
  { href: "/dashboard/ai", label: "AI HQ", permission: "ai:read", icon: <Bot className="h-4 w-4" /> },
  { href: "/dashboard/insights", label: "Insights", permission: "ai:read", icon: <Lightbulb className="h-4 w-4" /> },
  { href: "/dashboard/reports", label: "Reports", permission: "ai:read", icon: <FileText className="h-4 w-4" /> },
  { href: "/dashboard/ai-agents", label: "AI Agents", permission: "ai:manage", icon: <Settings2 className="h-4 w-4" /> },
  { href: "/dashboard/assistant", label: "Assistant", permission: "ai:run", icon: <Bot className="h-4 w-4" /> },
  { href: "/dashboard/virtual-office", label: "Virtual Office", permission: "ai:virtual-office", icon: <Briefcase className="h-4 w-4" /> },
];

const opsNavItems: NavItem[] = [
  { href: "/dashboard/notifications", label: "Notifications", permission: "notification:read", icon: <Bell className="h-4 w-4" /> },
  { href: "/dashboard/activity", label: "Activity", permission: "activity:read", icon: <ActivitySquare className="h-4 w-4" /> },
  { href: "/dashboard/automations", label: "Automations", permission: "automation:read", icon: <Workflow className="h-4 w-4" /> },
  { href: "/dashboard/crm/leads", label: "CRM", permission: "crm:read", icon: <Contact2 className="h-4 w-4" /> },
  { href: "/dashboard/marketing/campaigns", label: "Marketing", permission: "marketing:read", icon: <Megaphone className="h-4 w-4" /> },
  { href: "/dashboard/loyalty/customers", label: "Loyalty", permission: "loyalty:read", icon: <HeartHandshake className="h-4 w-4" /> },
  { href: "/dashboard/finance/overview", label: "Finance", permission: "finance:read", icon: <LineChart className="h-4 w-4" /> },
];

const platformOpsNavItems: NavItem[] = [
  { href: "/dashboard/ops/health", label: "Health", permission: "ops:health", icon: <Activity className="h-4 w-4" /> },
  { href: "/dashboard/ops/errors", label: "Errors", permission: "ops:errors", icon: <AlertCircle className="h-4 w-4" /> },
  { href: "/dashboard/ops/backups", label: "Backups", permission: "ops:jobs", icon: <Database className="h-4 w-4" /> },
  { href: "/dashboard/ops/security", label: "Security", permission: "ops:security", icon: <ShieldCheck className="h-4 w-4" /> },
  { href: "/dashboard/ops/audit", label: "Audit", permission: "ops:audit", icon: <FileSearch className="h-4 w-4" /> },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasPermission, hasAnyPermission } = useAuth();
  const canSeePosPayroll = hasAnyPermission(["pos:read", "sales-rep:read", "sales-rep:kpi"]);
  const canSeeAI = hasAnyPermission(["ai:read", "ai:run", "ai:manage"]);
  const canSeeOps = hasAnyPermission(opsNavItems.map((item) => item.permission).filter(Boolean) as string[]);
  const canSeePlatformOps = hasAnyPermission(platformOpsNavItems.map((item) => item.permission).filter(Boolean) as string[]);
  const [collapsed, setCollapsed] = useState(false);
  const posSalesNavItems: NavItem[] = [
    { href: "/dashboard/pos/stands", label: "Stand / POS", permission: "pos:read", icon: <Store className="h-4 w-4" /> },
    {
      href: "/dashboard/sales-reps",
      label: "Sales Reps",
      permission: ["sales-rep:read", "sales-rep:kpi"],
      icon: <Users2 className="h-4 w-4" />,
    },
  ];
  const hasNavPermission = (item: NavItem) => {
    if (!item.permission) return true;
    if (Array.isArray(item.permission)) {
      return hasAnyPermission(item.permission);
    }
    return hasPermission(item.permission);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className={cn("hidden border-r border-border bg-card/70 px-3 py-6 shadow-sm transition-all md:block", collapsed ? "w-16" : "w-64")}>
        <div className="mb-6 flex items-center justify-between">
          <div className={cn("space-y-1", collapsed && "hidden")}>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">MH-OS</div>
            <div className="text-xl font-semibold">SuperAdmin</div>
            <p className="text-xs text-muted-foreground">Control center</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle navigation">
            {collapsed ? "›" : "‹"}
          </Button>
        </div>
        <nav className="space-y-2">
          {coreNavItems
            .filter((item) => hasNavPermission(item))
            .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/70",
                pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary",
              )}
              title={item.label}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          {canSeePosPayroll && (
            <div className="pt-4">
              {!collapsed && (
                <div className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">POS & Sales</div>
              )}
              {posSalesNavItems
                .filter((item) => hasNavPermission(item))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/70",
                      pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary",
                    )}
                    title={item.label}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                ))}
            </div>
          )}
          {canSeeAI && (
            <div className="pt-4">
              {!collapsed && <div className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">AI</div>}
              {aiNavItems
                .filter((item) => hasNavPermission(item))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/70",
                      pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary",
                    )}
                    title={item.label}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
              ))}
            </div>
          )}
          {canSeeOps && (
            <div className="pt-4">
              {!collapsed && <div className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">Ops</div>}
              {opsNavItems
                .filter((item) => hasNavPermission(item))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/70",
                      pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary",
                    )}
                    title={item.label}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
              ))}
            </div>
          )}
          {canSeePlatformOps && (
            <div className="pt-4">
              {!collapsed && (
                <div className="px-3 pb-2 text-xs font-semibold uppercase text-muted-foreground">Platform Ops</div>
              )}
              {platformOpsNavItems
                .filter((item) => hasNavPermission(item))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-accent/70",
                      pathname === item.href && "bg-primary text-primary-foreground shadow-sm hover:bg-primary",
                    )}
                    title={item.label}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                ))}
            </div>
          )}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="md:hidden" onClick={() => router.push("/dashboard")}>Menu</Button>
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden md:inline-flex">{user?.role ?? "Guest"}</Badge>
            <NotificationBell />
            <ThemeToggle />
            <div className="text-sm text-right">
              <div className="font-semibold">{user?.email ?? "Guest"}</div>
              <div className="text-muted-foreground">Secure Workspace</div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
