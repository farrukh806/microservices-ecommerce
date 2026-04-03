import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
export const isAuthenticated = createMiddleware(async (req, next) => {
    const auth = getAuth(req);
    if (!auth.userId) {
        req.status(401);
        return req.json({
            message: "User is not authenticated",
        });
    }
    req.set("userId", auth.userId);
    await next();
});
