export const getTransactionByUserIdSchema = {
  params: {
    type: "object",
    properties: {
      userId: {
        type: "number",
      },
    },
  },
  response: {
    200: {
      type: "array",
      properties: {
        id: {
          type: "number",
        },
        userId: {
          type: "number",
        },
        sourceCurrency: {
          type: "string",
        },
        targetCurrency: {
          type: "string",
        },
        sourceAmount: {
          type: "number",
        },
        targetAmount: {
          type: "number",
        },
        exchangeRate: {
          type: "number",
        },
        createdAt: {
          type: "string",
        },
      },
    },
  },
  description:
    "This route find all transaction/currency convertion of a user by userId",
};
