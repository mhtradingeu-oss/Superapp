export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}

export interface BrandCreatedPayload {
  id: string;
  name: string;
}
