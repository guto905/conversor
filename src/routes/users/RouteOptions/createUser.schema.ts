export const createUserSchema = {
  body: {
    type: "object",
    properties: {
      name: {
        type: "string",
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
    400: {
      type: "string",
      default: "Invalid or empty field 'name'",
    },
    409: {
      type: "string",
      default: "This user name already exists",
    },
  },
  description: "This route creates a new user"
};
