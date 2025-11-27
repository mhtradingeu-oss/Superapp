import type { CreateProductInput, UpdateProductInput } from "./product.types.js";

export const productService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id };
  },

  async create(input: CreateProductInput) {
    // TODO: create record
    return { id: `new-product-id`, ...input };
  },

  async update(id: string, input: UpdateProductInput) {
    // TODO: update record
    return { id, ...input };
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
