export interface CreateLoyaltyInput {
  name?: string;
}

export interface UpdateLoyaltyInput extends Partial<CreateLoyaltyInput> {}

export interface LoyaltyEventPayload {
  id: string;
}
