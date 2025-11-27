"use client";

import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateProduct } from "@/lib/api/product";
import { listPricing } from "@/lib/api/pricing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api/client";

const schema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  brandId: z.string().optional(),
  status: z.string().optional(),
});

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const { data, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id), enabled: Boolean(id) });
  const pricingQuery = useQuery({
    queryKey: ["pricing", id],
    queryFn: async () => {
      const pricingList = await listPricing({ productId: id });
      return pricingList.data[0];
    },
    enabled: Boolean(id),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sku: "",
      brandId: "",
      status: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        sku: data.sku ?? "",
        brandId: data.brandId ?? "",
        status: data.status ?? "",
      });
    }
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: (payload: z.infer<typeof schema>) => updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Product updated");
      void queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (!hasPermission(["product:read", "product:update"])) return <div>Access denied.</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{data.name}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/products")}>Back</Button>
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
        <div className="space-y-2">
          <Label>Description</Label>
          <Input {...form.register("description")} />
        </div>
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input {...form.register("sku")} />
        </div>
        <div className="space-y-2">
          <Label>Brand ID</Label>
          <Input {...form.register("brandId")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Input {...form.register("status")} />
        </div>
        {hasPermission("product:update") && (
          <div className="md:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Pricing Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {pricingQuery.isLoading ? (
            <div>Loading pricing...</div>
          ) : pricingQuery.data ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>B2C Net: {pricingQuery.data.b2cNet ?? "-"}</div>
              <div>B2C Gross: {pricingQuery.data.b2cGross ?? "-"}</div>
              <div>Dealer Net: {pricingQuery.data.dealerNet ?? "-"}</div>
              <div>VAT %: {pricingQuery.data.vatPct ?? "-"}</div>
            </div>
          ) : (
            <div>No pricing yet.</div>
          )}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${id}/pricing/drafts`)}>
              Manage drafts
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${id}/pricing/competitors`)}>
              Competitors
            </Button>
            <Button variant="outline" onClick={() => router.push(`/dashboard/products/${id}/pricing/logs`)}>
              Pricing logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
