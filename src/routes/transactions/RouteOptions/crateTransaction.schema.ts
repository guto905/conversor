export const createTransactionSchema = {
  body: {
    type: "object",
    properties: {
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
    },
  },
  response: {
    200: {
      type: "object",
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
      default: "Invalid or empty fields, fill in all fields",
    },
    404: {
      type: "string",
      default: "User not found",
    },
  },
  description: "This route creates new transaction/currency convertion",
};
