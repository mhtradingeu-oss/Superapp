export interface CreateMarketingInput {
  brandId?: string;
  channelId?: string;
  name: string;
  objective?: string;
  budget?: number;
  status?: string;
}

export interface UpdateMarketingInput extends Partial<CreateMarketingInput> {}

export interface CampaignRecord {
  id: string;
  brandId?: string;
  channelId?: string;
  name: string;
  objective?: string;
  budget?: number | null;
  status?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketingEventPayload {
  id: string;
  brandId?: string;
}
