import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Breadcrumb = { label: string; href?: string };

/**
 * PageHeader enforces consistent page intros (title, subtitle, actions) across MH-OS.
 * Keep it minimal: primary actions on the right, meta/breadcrumbs on the left for context.
 */
type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function PageHeader({ title, description, actions, meta, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-3 rounded-xl bg-card/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between", className)}>
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <span className="opacity-60">/</span>}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          {meta}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

type HeaderActionProps = {
  onClick?: () => void;
  children: ReactNode;
  variant?: "secondary" | "default" | "outline";
};

export function HeaderAction({ onClick, children, variant = "secondary" }: HeaderActionProps) {
  return (
    <Button variant={variant} size="sm" onClick={onClick}>
      {children}
    </Button>
  );
}
