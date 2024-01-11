import { expect, test } from "bun:test";
import { Hitchhiker} from "lib/hitchhiker";

const PORT = 8080;

test("You can add GET routes", async () => {
  const app = new Hitchhiker();
  app.get("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add POST routes", async () => {
  const app = new Hitchhiker();
  app.post("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add PUT routes", async () => {
  const app = new Hitchhiker();
  app.put("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add DELETE routes", async () => {
  const app = new Hitchhiker();
  app.delete("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add PATCH routes", async () => {
  const app = new Hitchhiker();
  app.get("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add HEAD routes", async () => {
  const app = new Hitchhiker();
  app.head("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add OPTIONS routes", async () => {
  const app = new Hitchhiker();
  app.options("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add CONNECT routes", async () => {
  const app = new Hitchhiker();
  app.connect("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
test("You can add TRACE routes", async () => {
  const app = new Hitchhiker();
  app.trace("/at", () => new Response("hello")).listen(PORT); 
  const response = await fetch("localhost:8080/at");
  const html = await response.text();
  expect(html).toBe("hello"); 
  app.stop();
});
