const { UserRoute } = require("../routes/users/index.route")
const fastify = require("fastify")();
const { prisma } = require('../utils/db')

fastify.register(UserRoute, { prefix: "/users"});

describe("User routes", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  })

  beforeAll(async () => {
    await fastify.listen();
  });

  afterAll(async () => {
    await fastify.close();
  });

  /* Scuccess Tests */

  test("POST /users --> should create a user", async () => {
    const user = { name: "johndoe" };

    const response = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    const parsedUser = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(parsedUser.name).toEqual(user.name);
  });

  test("GET /users --> should find all users", async () => {
    const user = { name: "johndoe" };

    const response = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    const parsedUser = JSON.parse(response.body)

    expect(response.statusCode).toBe(201);
    expect(parsedUser.name).toEqual(user.name);

    const getAllUsersResponse = await fastify.inject({
      method: "GET",
      url: `/users`,
    });

    expect(getAllUsersResponse.statusCode).toBe(200);
    expect(JSON.parse(getAllUsersResponse.body)).toHaveLength(1);
  });

  test("GET /users/:id --> should find a user by id", async () => {
    const user = { name: "johndoe" };

    const response = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    const parsedUser = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(parsedUser.name).toEqual(user.name);

    const getUserByIdResponse = await fastify.inject({
      method: "GET",
      url: `/users/${parsedUser.id}`,
    });

    expect(getUserByIdResponse.statusCode).toBe(200);
    expect(JSON.parse(getUserByIdResponse.body).name).toEqual(user.name);
  });

  /* Failure Tests */

  test("POST /users --> should'nt create a user with a empty name", async () => {
    const user = { name: "" };

    const response = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Invalid or empty field 'name'");
  });
});
