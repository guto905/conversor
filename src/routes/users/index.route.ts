import { FastifyInstance } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { prisma } from "../../utils/db";

// Route Options
import { createUserSchema } from "./RouteOptions/createUser.schema";
import { getUserById } from "./RouteOptions/getUserById.schema";
import { getUsersSchema } from "./RouteOptions/getUsers.schema";

// Types
import { CreateUserBodyType, GetUserByIdType } from "./types/index.types";

export async function UserRoute(server: FastifyInstance) {
  // Create User
  server.post(
    "/",
    { schema: createUserSchema },
    async (
      request: FastifyRequest<{
        Body: CreateUserBodyType;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { name } = request.body;

        if (!name || typeof name !== "string")
          return reply.status(400).send("Invalid or empty field 'name'");

        const user = await prisma.user.findMany({ where: { name } });

        if (user.length)
          return reply.status(409).send("This user name already exists");

        return reply.status(201).send(
          await prisma.user.create({
            data: { name, createdAt: Date.now().toString() },
          })
        );
      } catch (error) {
        return reply.status(400).send(error);
      }
    }
  );

  // Get Users
  server.get(
    "/",
    { schema: getUsersSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.status(200).send(
        await prisma.user.findMany({
          select: {
            id: true,
            name: true,
          },
        })
      );
    }
  );

  // Get User By Id
  server.get(
    "/:id",
    { schema: getUserById },
    async (
      request: FastifyRequest<{ Params: GetUserByIdType }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      if (!id || typeof id !== "number")
        return reply.status(400).send("Invalid or empty field 'id'");

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (user) {
        return reply.status(200).send(user);
      } else {
        return reply.status(404).send("User not found");
      }
    }
  );
}
