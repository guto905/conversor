import { Transaction } from "./transaction.schema";
import { User } from "./user.schema";

export const schemas = [...User, ...Transaction];
