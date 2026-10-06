// Tests run by the Jenkins pipeline before every deployment (Node's built-in test runner)
const test = require("node:test");
const assert = require("node:assert");

// Point the app at a port where nothing is listening, to test the error path
process.env.BACKEND_URL = "http://127.0.0.1:1";
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test("GET / shows the form", async () => {
  const response = await fetch(baseUrl + "/");
  const html = await response.text();
  assert.strictEqual(response.status, 200);
  assert.match(html, /Submit Your Details/);
});

test("POST /submit shows an error when the backend is unreachable", async () => {
  const response = await fetch(baseUrl + "/submit", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "name=Rohan&email=rohan%40example.com",
  });
  const html = await response.text();
  assert.strictEqual(response.status, 200);
  assert.match(html, /Could not reach backend/);
});
