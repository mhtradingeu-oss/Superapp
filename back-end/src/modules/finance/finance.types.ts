export interface CreateFinanceInput {
  name?: string;
}

export interface UpdateFinanceInput extends Partial<CreateFinanceInput> {}

export interface FinanceEventPayload {
  id: string;
}
