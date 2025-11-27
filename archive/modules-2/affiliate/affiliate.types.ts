export interface CreateAffiliateInput {
  name?: string;
}

export interface UpdateAffiliateInput extends Partial<CreateAffiliateInput> {}

export interface AffiliateEventPayload {
  id: string;
}
