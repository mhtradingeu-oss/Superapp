export interface CreatePricingInput {
  name?: string;
}

export interface UpdatePricingInput extends Partial<CreatePricingInput> {}

export interface PricingEventPayload {
  id: string;
}
