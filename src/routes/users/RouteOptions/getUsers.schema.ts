export const getUsersSchema = {
  response: {
    200: {
      type: "array",
      properties: {
        id: {
          type: "number",
        },
        name: {
          type: "string",
        },
        createdAt: {
          type: "string",
        },
      },
    },
  },
  description: "This route find all users.",
};
