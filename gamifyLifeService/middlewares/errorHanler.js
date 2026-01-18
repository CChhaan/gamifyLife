import { error } from "../shared/response.js";

export default async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (err) {
        const status = err.status || 500;
        ctx.status = status;
        ctx.body = error(status, err.message);
    }
}