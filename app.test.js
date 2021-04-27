const app = require("./express");
const axios = require("axios");

test("app should be defined", () => {
  expect(app).toBeDefined();
});

test("status should be 200 ok", () => {
  return axios.get("http://localhost:3000/posts").then((response) => {
    expect(response.data).toEqual({
      success: true,
      data: [],
    });
  });
});
