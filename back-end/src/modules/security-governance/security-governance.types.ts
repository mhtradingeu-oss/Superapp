export interface CreateSecurityGovernanceInput {
  name?: string;
}

export interface UpdateSecurityGovernanceInput extends Partial<CreateSecurityGovernanceInput> {}

export interface SecurityGovernanceEventPayload {
  id: string;
}
