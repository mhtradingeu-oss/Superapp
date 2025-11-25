export interface CreateOperationsInput {
  name?: string;
}

export interface UpdateOperationsInput extends Partial<CreateOperationsInput> {}

export interface OperationsEventPayload {
  id: string;
}
