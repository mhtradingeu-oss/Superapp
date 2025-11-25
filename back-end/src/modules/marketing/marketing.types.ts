export interface CreateMarketingInput {
  name?: string;
}

export interface UpdateMarketingInput extends Partial<CreateMarketingInput> {}

export interface MarketingEventPayload {
  id: string;
}
