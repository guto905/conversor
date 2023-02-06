export const getUserById = {
  params: {
    type: "object",
    properties: {
      id: {
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
        name: {
          type: "string",
        },
        createdAt: {
          type: "string",
        },
      },
    },
    404: {
      type: "string",
      default: "User not found",
    },
  },
  description: "This route find a user by id.",
};
