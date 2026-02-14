import Fastify from "fastify";
const PORT = 8001

const fastify = Fastify();

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  console.log(`Order service is running on port ${PORT}`)
});
