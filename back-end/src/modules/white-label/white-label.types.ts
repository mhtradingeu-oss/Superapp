export interface CreateWhiteLabelInput {
  name?: string;
}

export interface UpdateWhiteLabelInput extends Partial<CreateWhiteLabelInput> {}

export interface WhiteLabelEventPayload {
  id: string;
}
