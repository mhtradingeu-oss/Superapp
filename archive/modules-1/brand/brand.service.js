export const brandService = {
    async list() {
        // TODO: fetch brands via Prisma
        return [];
    },
    async getById(id) {
        // TODO: fetch brand by id
        return { id };
    },
    async create(input) {
        // TODO: create brand
        return { id: "new-brand-id", ...input };
    },
    async update(id, input) {
        // TODO: update brand
        return { id, ...input };
    },
    async remove(id) {
        // TODO: delete brand
        return { id };
    },
};
