export interface CreateKnowledgeBaseInput {
  name?: string;
}

export interface UpdateKnowledgeBaseInput extends Partial<CreateKnowledgeBaseInput> {}

export interface KnowledgeBaseEventPayload {
  id: string;
}
