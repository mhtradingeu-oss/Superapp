export interface CreatePartnersInput {
  name?: string;
}

export interface UpdatePartnersInput extends Partial<CreatePartnersInput> {}

export interface PartnersEventPayload {
  id: string;
}
