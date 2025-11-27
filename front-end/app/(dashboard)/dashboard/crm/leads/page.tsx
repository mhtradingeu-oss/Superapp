"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLead, listLeads, updateLead } from "@/lib/api/crm";
import { apiErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { PageHeader } from "@/components/layout/page-header";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Badge } from "@/components/ui/badge";

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ name: "", email: "", status: "new" });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["crm-leads", search],
    queryFn: () => listLeads({ search }),
  });

  const filteredLeads = useMemo(() => {
    if (!data?.data) return [];
    if (!search.trim()) return data.data;
    return data.data.filter((lead) => (lead.name ?? "").toLowerCase().includes(search.toLowerCase()));
  }, [data?.data, search]);

  const stats = useMemo(() => {
    const leads = filteredLeads;
    const won = leads.filter((lead) => lead.status === "won").length;
    const lost = leads.filter((lead) => lead.status === "lost").length;
    return {
      total: leads.length,
      won,
      lost,
      conversion: leads.length ? Math.round((won / leads.length) * 100) : 0,
    };
  }, [filteredLeads]);

  const createMutation = useMutation({
    mutationFn: () => createLead(draft),
    onSuccess: () => {
      setDraft({ name: "", email: "", status: "new" });
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; status: string }) => updateLead(payload.id, { status: payload.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["crm-leads", search] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM Leads"
        description="Pipeline view, scoring, and quick actions to nudge prospects."
        meta={<InfoTooltip content="Filters update local view; scoring and routing happen in CRM service." />}
        actions={
          <Input
            placeholder="Search leads"
            className="w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-muted-foreground">Total leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Current view</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-muted-foreground">Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.won}</div>
            <p className="text-xs text-muted-foreground">Closed deals</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs uppercase text-muted-foreground">Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.conversion}%</div>
            <p className="text-xs text-muted-foreground">Won/total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm space-y-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Quick add lead</h2>
            <InfoTooltip content="Capture basic lead data before routing to reps." />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            <Input placeholder="Email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            <Input placeholder="Status" value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} />
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isLoading || !draft.email}>
              {createMutation.isLoading ? "Saving..." : "Create"}
            </Button>
          </div>
          {createMutation.isError && <div className="text-sm text-destructive mt-2">{apiErrorMessage(createMutation.error)}</div>}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Lead list</h2>
              <InfoTooltip content="Statuses can be toggled to update the pipeline." />
            </div>
            <p className="text-xs text-muted-foreground">Use actions to mark won/lost quickly.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Filter: {search ? `contains "${search}"` : "all leads"}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="h-4 w-4" />
              Loading leads...
            </div>
          ) : isError ? (
            <div className="text-sm text-destructive">Error: {apiErrorMessage(error)}</div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-semibold">{lead.name ?? "Unnamed lead"}</div>
                        <div className="text-xs text-muted-foreground">{lead.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] uppercase">
                          {lead.status ?? "new"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.email ?? "n/a"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2 text-xs">
                        <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: lead.id, status: "won" })}>
                          Mark won
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: lead.id, status: "lost" })}>
                          Mark lost
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
