import { BaseSchema } from "../core/base.schema";
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const UserSchema = z.object({
  ...BaseSchema,
  name: z.string(),
});

const UserInput = z.object({
  name: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

export const { schemas: User, $ref } = buildJsonSchemas(
  {
    UserSchema,
    UserInput,
  },
  {
    $id: "users",
  }
);
