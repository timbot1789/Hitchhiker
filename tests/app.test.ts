import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { Hitchhiker } from "lib/hitchhiker";

const PORT = 8080;

describe("basic tests", () => {
  let app: Hitchhiker = new Hitchhiker();
  beforeEach(() => {
    app = new Hitchhiker();
  });
  afterEach(() => {
    app.stop();
  });
  test("You can add GET routes", async () => {
    app.get("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add POST routes", async () => {
    app.post("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add PUT routes", async () => {
    app.put("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add DELETE routes", async () => {
    app.delete("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add PATCH routes", async () => {
    app.get("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add HEAD routes", async () => {
    app.head("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add OPTIONS routes", async () => {
    app.options("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add CONNECT routes", async () => {
    app.connect("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
  test("You can add TRACE routes", async () => {
    app.trace("/at", () => new Response("hello")).listen(PORT);
    const response = await fetch("localhost:8080/at");
    const html = await response.text();
    expect(html).toBe("hello");
  });
});
describe("advanced tests", () => {
  let app: Hitchhiker = new Hitchhiker();
  beforeEach(() => {
    app = new Hitchhiker();
  });
  afterEach(() => {
    app.stop();
  });
  test("Unknown paths return 404", async () => {
    app.get("/at", () => new Response()).listen(PORT);
    const response = await fetch(`localhost:${PORT}/fakeRoute`);
    expect(response.status).toBe(404);
  });
  test("allows dynamic routes", async () => {
    app.get("/:id", () => new Response("dynamic routes")).listen(PORT);
    const response = await fetch(`localhost:${PORT}/430`);
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toBe("dynamic routes");
  });
});
