export interface CreateSalesRepsInput {
  name?: string;
}

export interface UpdateSalesRepsInput extends Partial<CreateSalesRepsInput> {}

export interface SalesRepsEventPayload {
  id: string;
}
