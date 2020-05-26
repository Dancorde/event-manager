const request = require("supertest");
const jwt = require("jsonwebtoken");

const Event = require("./events.model");
const User = require("../users/users.model");

const db = require("../startup/db");
const route = "/api/events/";
let server;
let token;

describe("Events Service", () => {
  beforeEach(async () => {
    server = require("../server");
    const user = new User({
      email: "email2@test.com",
      password: "test",
    });
    res = await user.save();

    token = await jwt.sign(
      { email: res.email, userId: res._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  });

  afterEach(async () => {
    server.close();
    await Event.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("Should return an empty events list", async () => {
    const res = await request(server)
      .get(route)
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Events fetched successfully");
    expect(res.body.events).toBeTruthy();
    expect(res.body.events).toEqual([]);
  });

  it("Shold create a new event", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = {
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    };

    const res = await request(server)
      .post(route)
      .set("Authorization", "Bearer " + token)
      .send(event);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Event created");
  });

  it("Should not create a new event if it overlays an existing one", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = new Event({
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    });

    const overlayEvent = {
      description: "teste",
      startTime: "2020-06-30T18:00:32.355Z",
      endTime: "2020-06-30T19:00:32.355Z",
      creator: decodedToken.userId,
    };

    await event.save();

    const res = await request(server)
      .post(route)
      .set("Authorization", "Bearer " + token)
      .send(overlayEvent);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe(
      "Can't create event. The event overlays another one!"
    );
  });

  it("Shold get the event", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = new Event({
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    });

    let res = await event.save();

    res = await request(server)
      .get(route + res._id)
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);
  });

  it("Shold not get the event if the id is not valid", async () => {
    res = await request(server)
      .get(route + "5ec96cc8229bff0b4f56b27d")
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Event not found");
  });

  it("Shold delete the event", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = new Event({
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    });

    let res = await event.save();

    res = await request(server)
      .delete(route + res._id)
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event deleted!");
  });

  it("Shold not delete the event if the id is not valid", async () => {
    res = await request(server)
      .delete(route + "5ec96cc8229bff0b4f56b27d")
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Event not found!");
  });

  it("Shold update the event", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = new Event({
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    });

    let res = await event.save();

    res = await request(server)
      .patch(route + res._id)
      .set("Authorization", "Bearer " + token)
      .send({
        description: "teste2",
        startTime: "2020-06-30T17:17:32.355Z",
        endTime: "2020-06-30T18:17:32.355Z",
        creator: decodedToken.userId,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Event updated successfully!");
  });

  it("Shold update the event", async () => {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    const event = new Event({
      description: "teste",
      startTime: "2020-06-30T17:17:32.355Z",
      endTime: "2020-06-30T18:17:32.355Z",
      creator: decodedToken.userId,
    });

    const event2 = new Event({
      description: "teste2",
      startTime: "2020-06-30T19:17:32.355Z",
      endTime: "2020-06-30T20:17:32.355Z",
      creator: decodedToken.userId,
    });

    await event.save();
    let res = await event2.save();

    res = await request(server)
      .patch(route + res._id)
      .set("Authorization", "Bearer " + token)
      .send({
        description: "teste2",
        startTime: "2020-06-30T17:17:32.355Z",
        endTime: "2020-06-30T18:17:32.355Z",
        creator: decodedToken.userId,
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe(
      "Can't update event. The event overlays another one!"
    );
  });
});
