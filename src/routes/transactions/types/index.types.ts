export type CreateTransactionBodyType = {
  userId: number;
  sourceCurrency: "BRL" | "USD" | "EUR" | "JPY";
  targetCurrency: "BRL" | "USD" | "EUR" | "JPY";
  sourceAmount: number;
};

export type GetTransactionByIdParamsType = {
  userId: number;
};
