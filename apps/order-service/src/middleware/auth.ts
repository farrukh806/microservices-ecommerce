import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { userId } = getAuth(request);
  if (!userId) return reply.status(401).send({ message: "User is not authenticated" });
  request.userId = userId;
};
