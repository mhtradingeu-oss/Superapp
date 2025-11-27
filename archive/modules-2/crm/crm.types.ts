export interface CreateCrmInput {
  name?: string;
}

export interface UpdateCrmInput extends Partial<CreateCrmInput> {}

export interface CrmEventPayload {
  id: string;
}
