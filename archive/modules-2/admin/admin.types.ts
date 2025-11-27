export interface CreateAdminInput {
  name?: string;
}

export interface UpdateAdminInput extends Partial<CreateAdminInput> {}

export interface AdminEventPayload {
  id: string;
}
