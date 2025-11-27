import { knowledge_baseService } from "./knowledge-base.service.js";
export async function list(_req, res, next) {
    try {
        const items = await knowledge_baseService.list();
        res.json(items);
    }
    catch (err) {
        next(err);
    }
}
export async function getById(req, res, next) {
    try {
        const item = await knowledge_baseService.getById(req.params.id);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const item = await knowledge_baseService.create(req.body);
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const item = await knowledge_baseService.update(req.params.id, req.body);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        await knowledge_baseService.remove(req.params.id);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}
