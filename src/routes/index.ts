import { TransactionRoute } from "./transactions/index.route";
import { UserRoute } from "./users/index.route";

export const routes = [
  {
    route: TransactionRoute,
    prefix: "/transactions",
  },
  {
    route: UserRoute,
    prefix: "/users",
  },
];
