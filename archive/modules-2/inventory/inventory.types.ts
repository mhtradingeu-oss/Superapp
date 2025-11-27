export interface CreateInventoryInput {
  name?: string;
}

export interface UpdateInventoryInput extends Partial<CreateInventoryInput> {}

export interface InventoryEventPayload {
  id: string;
}
