export interface CreateAiBrainInput {
  name?: string;
}

export interface UpdateAiBrainInput extends Partial<CreateAiBrainInput> {}

export interface AiBrainEventPayload {
  id: string;
}
