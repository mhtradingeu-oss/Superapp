"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBrand, updateBrand } from "@/lib/api/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-context";
import { apiErrorMessage } from "@/lib/api/client";

const schema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  defaultCurrency: z.string().optional(),
  settings: z.string().optional(),
});

export default function BrandDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const { data, isLoading } = useQuery({ queryKey: ["brand", id], queryFn: () => getBrand(id), enabled: Boolean(id) });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      countryOfOrigin: "",
      defaultCurrency: "",
      settings: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        countryOfOrigin: data.countryOfOrigin ?? "",
        defaultCurrency: data.defaultCurrency ?? "",
        settings: data.settings ? JSON.stringify(data.settings, null, 2) : "",
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (payload: z.infer<typeof schema>) => {
      let parsedSettings: Record<string, unknown> = {};
      if (payload.settings) {
        try {
          parsedSettings = JSON.parse(payload.settings) as Record<string, unknown>;
        } catch {
          parsedSettings = {};
        }
      }
      const { settings, ...rest } = payload;
      return updateBrand(id, { ...rest, settings: parsedSettings });
    },
    onSuccess: () => {
      toast.success("Brand updated");
      void queryClient.invalidateQueries({ queryKey: ["brand", id] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (!hasPermission(["brand:read", "brand:update"])) return <div>Access denied.</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{data.name}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/brands")}>Back</Button>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input {...form.register("slug")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Input {...form.register("description")} />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input {...form.register("countryOfOrigin")} />
        </div>
        <div className="space-y-2">
          <Label>Default Currency</Label>
          <Input {...form.register("defaultCurrency")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Settings JSON</Label>
          <textarea className="min-h-[160px] w-full rounded-md border border-input bg-background p-2 text-sm" {...form.register("settings")} />
          <p className="text-xs text-muted-foreground">Metadata, preferences, linkedUserIds, etc.</p>
        </div>
        {hasPermission("brand:update") && (
          <div className="md:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
