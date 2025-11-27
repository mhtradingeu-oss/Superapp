export interface CreateSecurityGovernanceInput {
  name: string;
  rulesJson?: string | null;
}

export interface UpdateSecurityGovernanceInput extends Partial<CreateSecurityGovernanceInput> {}

export interface SecurityGovernanceEventPayload {
  id: string;
  name: string;
}
