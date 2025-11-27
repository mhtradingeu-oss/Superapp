export interface CreateLeadInput {
  brandId?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  ownerId?: string;
  sourceId?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}

export interface LeadRecord {
  id: string;
  brandId?: string;
  status?: string;
  ownerId?: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrmEventPayload {
  id: string;
  brandId?: string;
  status?: string | null;
}
