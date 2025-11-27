export interface CreateCommunicationInput {
  name?: string;
}

export interface UpdateCommunicationInput extends Partial<CreateCommunicationInput> {}

export interface CommunicationEventPayload {
  id: string;
}
