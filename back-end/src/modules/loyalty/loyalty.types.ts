export interface CreateLoyaltyInput {
  brandId?: string;
  programId: string;
  userId?: string;
  personId?: string;
  pointsBalance?: number;
  tier?: string;
}

export interface UpdateLoyaltyInput extends Partial<CreateLoyaltyInput> {
  pointsDelta?: number;
  reason?: string;
}

export interface LoyaltyCustomerRecord {
  id: string;
  brandId?: string;
  programId: string;
  userId?: string;
  personId?: string;
  pointsBalance: number;
  tier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyEventPayload {
  id: string;
  brandId?: string;
  programId?: string;
  pointsDelta?: number;
}
