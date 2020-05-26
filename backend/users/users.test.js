const request = require("supertest");
const User = require("./users.model");

const route = "/api/users/";
let server;

describe("Users Service", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  it("Should signup a new user", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    res = await request(server)
      .post(route + "signup")
      .send(user);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created");
    expect(res.body.result.email).toBe(user.email);
    expect(res.body.result.password).toBeTruthy();
  });

  it("Should not signup a new user if email already exists", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    await request(server)
      .post(route + "signup")
      .send(user);

    res = await request(server)
      .post(route + "signup")
      .send(user);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("E-mail already exists!");
  });

  it("Should not signup a new user if the password is not a string", async () => {
    const user = {
      email: "email@test.com",
      password: 1234,
    };

    res = await request(server)
      .post(route + "signup")
      .send(user);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Invalid password!");
    expect(res.body.error).toBeTruthy();
  });

  it("Should login with a valid email and password", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    await request(server)
      .post(route + "signup")
      .send(user);

    res = await request(server)
      .post(route + "login")
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.expiresIn).toBe(3600);
  });

  it("Should not login with a invalid email", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    await request(server)
      .post(route + "signup")
      .send(user);

    res = await request(server)
      .post(route + "login")
      .send({
        email: "another_email@test.com",
        password: "test",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication failed!");
  });

  it("Should not login with a invalid password", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    await request(server)
      .post(route + "signup")
      .send(user);

    res = await request(server)
      .post(route + "login")
      .send({
        email: "email@test.com",
        password: "wrong",
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication failed!");
  });

  it("Should not login with a invalid email", async () => {
    const user = {
      email: "email@test.com",
      password: "test",
    };

    res = await request(server)
      .post(route + "login")
      .send(user);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication failed!");
  });

  it("Should return 404 for an invalid endpoint", async () => {
    const res = await request(server).get(route + "invalid");

    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
    expect(res.body.error.message).toBe("Not found");
  });
});
