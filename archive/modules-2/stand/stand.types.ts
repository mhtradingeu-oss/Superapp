export interface CreateStandInput {
  name?: string;
}

export interface UpdateStandInput extends Partial<CreateStandInput> {}

export interface StandEventPayload {
  id: string;
}
