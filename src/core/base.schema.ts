import { z } from "zod";

export const BaseSchema = {
  id: z.number(),
  createdAt: z.date().default(() => new Date()),
};
