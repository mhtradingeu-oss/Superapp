export interface CreateDealersInput {
  name?: string;
}

export interface UpdateDealersInput extends Partial<CreateDealersInput> {}

export interface DealersEventPayload {
  id: string;
}
