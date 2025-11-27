import { authService } from "./auth.service.js";
export async function registerHandler(req, res, next) {
    try {
        const result = await authService.register(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return next(err);
    }
}
export async function loginHandler(req, res, next) {
    try {
        const result = await authService.login(req.body);
        return res.json(result);
    }
    catch (err) {
        return next(err);
    }
}
export async function meHandler(req, res, next) {
    try {
        const user = req.user;
        return res.json({ user });
    }
    catch (err) {
        return next(err);
    }
}
