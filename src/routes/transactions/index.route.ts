import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/db";

// Services
import { TransactionService } from "../../services/transaction.service";

// Route Options
import { createTransactionSchema } from "./RouteOptions/crateTransaction.schema";
import { getTransactionByUserIdSchema } from "./RouteOptions/getTransactionByUserId.schema";

// Types
import {
  CreateTransactionBodyType,
  GetTransactionByIdParamsType,
} from "./types/index.types";
import { getTrasactionsSchema } from "./RouteOptions/getTransactions.chema";

export async function TransactionRoute(server: FastifyInstance) {
  // Create Conversion
  server.post(
    "/",
    { schema: createTransactionSchema },
    async (
      request: FastifyRequest<{ Body: CreateTransactionBodyType }>,
      reply: FastifyReply
    ) => {
      const { userId, sourceCurrency, targetCurrency, sourceAmount } =
        request.body;

      if (
        !userId ||
        typeof userId !== "number" ||
        !sourceCurrency ||
        !["BRL", "USD", "EUR", "JPY"].includes(sourceCurrency) ||
        !targetCurrency ||
        !["BRL", "USD", "EUR", "JPY"].includes(targetCurrency) ||
        !sourceAmount ||
        typeof sourceAmount !== "number"
      )
        reply.status(400).send("Invalid or empty fields, fill in all fields");

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) return reply.status(404).send("User not found");

      try {
        const response = await TransactionService.getConvertedValue({
          sourceAmount,
          sourceCurrency,
          targetCurrency,
          userId,
        });

        return reply.status(201).send({
          id: response.conversion.id,
          userId,
          sourceCurrency,
          sourceAmount: sourceAmount,
          targetCurrency,
          targetAmount: response.targetAmount,
          exchangeRate: response.conversion.exchangeRate,
          createdAt: response.conversion.createdAt,
        });
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  // Get Transactions of a UserId
  server.get(
    "/:userId",
    { schema: getTransactionByUserIdSchema },
    async (
      request: FastifyRequest<{ Params: GetTransactionByIdParamsType }>,
      reply: FastifyReply
    ) => {
      const { userId } = request.params;

      if (!userId || typeof userId !== "number")
        return reply.status(400).send("Invalid or empty field 'id'");

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user) return reply.status(404).send("User not found");

      const arrayOfTransactions = await prisma.transaction.findMany({
        where: { userId: Number(userId) },
      });

      reply.status(200).send(arrayOfTransactions ? arrayOfTransactions : []);
    }
  );

  // Get All Transactions
  server.get(
    "/",
    { schema: getTrasactionsSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send(await prisma.transaction.findMany());
    }
  );
}
