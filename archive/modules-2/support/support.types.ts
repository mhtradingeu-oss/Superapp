export interface CreateSupportInput {
  name?: string;
}

export interface UpdateSupportInput extends Partial<CreateSupportInput> {}

export interface SupportEventPayload {
  id: string;
}
