export interface CreateAutomationInput {
  name?: string;
}

export interface UpdateAutomationInput extends Partial<CreateAutomationInput> {}

export interface AutomationEventPayload {
  id: string;
}
