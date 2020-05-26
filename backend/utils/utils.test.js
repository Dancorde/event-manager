const Utils = require("./utils");

describe("Utils test", () => {
  describe("normalizePort", () => {
    it("should return the port normalized", () => {
      const val = 3000;

      res = Utils.normalizePort(val);

      expect(res).toBe(3000);
    });

    it("should return the value if it is NaN", () => {
      const val = "Test";

      res = Utils.normalizePort(val);

      expect(res).toBe("Test");
    });

    it("should return false if the port is < 0", () => {
      const val = -3000;

      res = Utils.normalizePort(val);

      expect(res).toBe(false);
    });
  });

  describe("parseDate", () => {
    it("should parse a valid date", () => {
      const val = "2020-06-30T17:17:32.355Z";

      const res = Utils.parseDate(val);

      expect(res.date.day).toBe("30");
      expect(res.date.month).toBe("06");
      expect(res.date.year).toBe("2020");
      expect(res.time.hour).toBe("17");
      expect(res.time.minute).toBe("17");
      expect(res.time.second).toBe("32");
    });
  });
});
