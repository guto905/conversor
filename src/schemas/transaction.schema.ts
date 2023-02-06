import { BaseSchema } from "../core/base.schema";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

export const TransactionSchema = z.object({
  ...BaseSchema,
  userId: z.number(),
  sourceCurrency: z.string(),
  targetCurrency: z.string(),
  sourceAmount: z.number(),
  exchangeRate: z.number(),
});

export type TransactionType = z.infer<typeof TransactionSchema>;

export const { schemas: Transaction, $ref } = buildJsonSchemas(
  {
    TransactionSchema,
  },
  {
    $id: "transactions",
  }
);
