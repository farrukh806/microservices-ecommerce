import type { FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (
  error: Error & { status?: number },
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);
  reply.status(error.status || 500).send({
    message: error.message || "Something went wrong",
  });
};
