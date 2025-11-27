export interface CreateProductInput {
  name?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductEventPayload {
  id: string;
}
