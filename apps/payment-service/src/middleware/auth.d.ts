type IAuthMiddleware = {
    Variables: {
        userId: string;
    };
};
export declare const isAuthenticated: import("hono").MiddlewareHandler<IAuthMiddleware, string, {}, Response>;
export {};
//# sourceMappingURL=auth.d.ts.map