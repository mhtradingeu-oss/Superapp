export interface CreateSocialIntelligenceInput {
  name?: string;
}

export interface UpdateSocialIntelligenceInput extends Partial<CreateSocialIntelligenceInput> {}

export interface SocialIntelligenceEventPayload {
  id: string;
}
