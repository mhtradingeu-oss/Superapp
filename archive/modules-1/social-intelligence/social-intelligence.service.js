export const social_intelligenceService = {
    async list() {
        // TODO: fetch list via Prisma
        return [];
    },
    async getById(id) {
        // TODO: fetch by id
        return { id };
    },
    async create(input) {
        // TODO: create record
        return { id: `new-social-intelligence-id`, ...input };
    },
    async update(id, input) {
        // TODO: update record
        return { id, ...input };
    },
    async remove(id) {
        // TODO: delete record
        return { id };
    },
};
