const {} = require("jest");
const { sum } = require("./config");

test("add two numbers", () => {
  expect(sum(1, 2)).toBe(3);
});
