export interface CreateFinanceInput {
  brandId?: string;
  productId?: string;
  channel?: string;
  amount: number;
  currency?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface UpdateFinanceInput extends Partial<CreateFinanceInput> {}

export interface FinanceRecord {
  id: string;
  brandId?: string;
  productId?: string;
  channel?: string;
  amount?: number | null;
  currency?: string | null;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceEventPayload {
  id: string;
  brandId?: string;
}
