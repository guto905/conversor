import fastify from "fastify";
import fastifySwagger from "fastify-swagger-deprecated";

import { schemas } from "./schemas";
import { routes } from "./routes";

const port = process.env.PORT || 3333;
const host = process.env.HOST || "localhost";

export const server = fastify({
  logger: true,
});

server.register(fastifySwagger, {
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "Node test",
      description: "API documentation for my app",
      version: "1.0.0",
    },
    host: `${host}:${port}`,
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  exposeRoute: true,
});

// Server connection
async function main() {
  schemas.forEach((schema) => server.addSchema(schema));
  routes.forEach(({ route, prefix }) => server.register(route, { prefix }));

  try {
    await server.listen(port, host);
    server.log.info(`Server is on ${host}:${port}`);
  } catch (err: any) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
