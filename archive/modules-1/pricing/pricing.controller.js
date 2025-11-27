import { pricingService } from "./pricing.service.js";
export async function list(_req, res, next) {
    try {
        const items = await pricingService.list();
        res.json(items);
    }
    catch (err) {
        next(err);
    }
}
export async function getById(req, res, next) {
    try {
        const item = await pricingService.getById(req.params.id);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function create(req, res, next) {
    try {
        const item = await pricingService.create(req.body);
        res.status(201).json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function update(req, res, next) {
    try {
        const item = await pricingService.update(req.params.id, req.body);
        res.json(item);
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        await pricingService.remove(req.params.id);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
}
