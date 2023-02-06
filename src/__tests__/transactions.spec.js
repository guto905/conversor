const { TransactionRoute } = require("../routes/transactions/index.route");
const { UserRoute } = require("../routes/users/index.route");
const fastify = require("fastify")();
const { prisma } = require('../utils/db');

jest.setTimeout(99999999) // increasing ms for a test.

fastify.register(TransactionRoute, { prefix: "/transactions"});
fastify.register(UserRoute, { prefix: "/users"});

describe("Transaction routes", () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  })

  beforeAll(async () => {
    await fastify.listen();
  });

  afterAll(async () => {
    await fastify.close();
  });
  
  /* Scuccess Tests */

  test("POST /transactions --> should create a transaction, convert BRL to USD", async () => {
    const user = { name: "johndoe 2" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/

    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "BRL",
      targetCurrency: "USD",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    const parsedTransaction = JSON.parse(transactionResponse.body)

    expect(userResponse.statusCode).toBe(201);
    expect(parsedTransaction.sourceAmount).toEqual(transaction.sourceAmount);
    expect(parsedTransaction.sourceCurrency).toEqual(transaction.sourceCurrency);
    expect(parsedTransaction.targetCurrency).toEqual(transaction.targetCurrency);
    expect(parsedTransaction.userId).toEqual(transaction.userId);
  });

  test("GET /transaction --> should should find transactions", async () => {
    const user = { name: "johndoe 3" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/

    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "BRL",
      targetCurrency: "USD",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    const parsedTransaction = JSON.parse(transactionResponse.body)

    expect(userResponse.statusCode).toBe(201);
    expect(parsedTransaction.sourceAmount).toEqual(transaction.sourceAmount);
    expect(parsedTransaction.sourceCurrency).toEqual(transaction.sourceCurrency);
    expect(parsedTransaction.targetCurrency).toEqual(transaction.targetCurrency);
    expect(parsedTransaction.userId).toEqual(transaction.userId);

    /* Transaction Created */

    const transactionsResponse = await fastify.inject({
      method: "GET",
      url: "/transactions"
    });

    const parsedTransactions = JSON.parse(transactionsResponse.body);

    expect(transactionsResponse.statusCode).toBe(200);
    expect(parsedTransactions.length).toBe(1)
  });

  test("GET /transaction/:userId --> should find transactions by userId", async () => {
    const user = { name: "johndoe 4" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/

    const transaction = { 
      userId: Number(parsedUser.id),
      sourceCurrency: "BRL",
      targetCurrency: "USD",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    const parsedTransaction = JSON.parse(transactionResponse.body)

    expect(userResponse.statusCode).toBe(201);
    expect(parsedTransaction.sourceAmount).toEqual(transaction.sourceAmount);
    expect(parsedTransaction.sourceCurrency).toEqual(transaction.sourceCurrency);
    expect(parsedTransaction.targetCurrency).toEqual(transaction.targetCurrency);
    expect(parsedTransaction.userId).toEqual(transaction.userId);

    /* Transaction Created */

    const transactionsResponse = await fastify.inject({
      method: "GET",
      url: `/transactions/${parsedUser.id}`
    });

    const parsedTransactions = JSON.parse(transactionsResponse.body);

    expect(transactionsResponse.statusCode).toBe(200);
    expect(parsedTransactions.length).toBe(1);
    expect(parsedTransactions[0].sourceCurrency).toBe(transaction.sourceCurrency);
    expect(parsedTransactions[0].targetCurrency).toBe(transaction.targetCurrency);
    expect(parsedTransactions[0].sourceAmount).toBe(transaction.sourceAmount);
  });

  /* Failure Tests */

  test("POST /transactions --> should'nt create a transaction with a empty sourceCurrency", async () => {
    const user = { name: "johndoe 5" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/
    
    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "",
      targetCurrency: "USD",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    expect(transactionResponse.statusCode).toBe(400);
    expect(transactionResponse.body).toBe("Invalid or empty fields, fill in all fields");
  });
  
  test("POST /transactions --> should'nt create a transaction with a invalid sourceCurrency", async () => {
    const user = { name: "johndoe 6" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/
    
    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: 123,
      targetCurrency: "USD",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    expect(transactionResponse.statusCode).toBe(400);
    expect(transactionResponse.body).toBe("Invalid or empty fields, fill in all fields");
  });

  test("POST /transactions --> should'nt create a transaction with a empty targetCurrency", async () => {
    const user = { name: "johndoe 7" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/
    
    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "BRL",
      targetCurrency: "",
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    expect(transactionResponse.statusCode).toBe(400);
    expect(transactionResponse.body).toBe("Invalid or empty fields, fill in all fields");
  });

  test("POST /transactions --> should'nt create a transaction with a invalid targetCurrency", async () => {
    const user = { name: "johndoe 8" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/
    
    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "BRL",
      targetCurrency: 123,
      sourceAmount: 15,
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    expect(transactionResponse.statusCode).toBe(400);
    expect(transactionResponse.body).toBe("Invalid or empty fields, fill in all fields");
  });

  test("POST /transactions --> should'nt create a transaction with a empty sourceAmount", async () => {
    const user = { name: "johndoe 9" };

    const userResponse = await fastify.inject({
      method: "POST",
      url: "/users",
      payload: user,
    });

    expect(userResponse.statusCode).toBe(201);

    const parsedUser = JSON.parse(userResponse.body);

    /* User Created with success!*/
    
    const transaction = { 
      userId: parsedUser.id,
      sourceCurrency: "BRL",
      targetCurrency: "USD",
    };

    const transactionResponse = await fastify.inject({
      method: "POST",
      url: "/transactions",
      payload: transaction,
    });

    expect(transactionResponse.statusCode).toBe(400);
    expect(transactionResponse.body).toBe("Invalid or empty fields, fill in all fields");
  });
});
