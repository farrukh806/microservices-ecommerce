import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@repo/product-db";

export const isAuthenticated = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const auth = getAuth(request);

  if (!auth || !auth.userId) {
    return reply.status(401).send({ message: "User is not authenticated" });
  }

  const clerkUserId = auth.userId;

  // Find or create user in database
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    // Create user with placeholder email - email should be synced via webhook in production
    user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: `${clerkUserId}@clerk.local`,
      },
    });
  }

  request.userId = user.id;
};