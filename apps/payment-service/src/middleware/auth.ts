import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import { prisma } from "@repo/product-db";

type IAuthMiddleware = {
    Variables : {
        userId: string
    }
}

export const isAuthenticated = createMiddleware<IAuthMiddleware>(async (req, next) => {
  const auth = getAuth(req);
  if (!auth.userId) {
    req.status(401);
    return req.json({
      message: "User is not authenticated",
    });
  }

  const clerkUserId = auth.userId;

  // Find or create user by Clerk ID to get internal user ID
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    // Create user with placeholder email
    user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: `${clerkUserId}@clerk.local`,
      },
    });
  }

  req.set("userId", user.id);
  await next();
});
