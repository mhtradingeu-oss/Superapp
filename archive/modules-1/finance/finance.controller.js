import { financeService } from "./finance.service.js";
export async function list(_req, res, next) {
    try {
        const items = await financeService.list();
        res.json(items);
    }
    catch (err) {
        next(err);
    }
}
export async function getById(req, res, next) {
    try {
        const item = await financeService.getById(req.params.id);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const item = await financeService.create(req.body);
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const item = await financeService.update(req.params.id, req.body);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        await financeService.remove(req.params.id);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}
