const checkAuth = require("../middlewares/check-auth");

describe("Authorization Middleware", () => {
  let req;
  let res = {};
  let next = jest.fn();

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    next.mockReset();
  });

  it("Should return 401 with a invalid token", async () => {
    const token = "Bearer invalidToken";
    req.headers.authorization = token;

    await checkAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
