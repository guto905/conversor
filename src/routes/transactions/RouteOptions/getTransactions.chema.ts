export const getTrasactionsSchema = {
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
    400: {
      type: "string",
      default: "Invalid or empty field 'id'",
    },
    404: {
      type: "string",
      default: "User not found",
    },
  },
  description: "This route find all transaction/currency convertion",
};
