import { expect, test } from "bun:test";
import { Hitchhiker} from "lib/hitchhiker";

test("You can add GET routes", () => {
  const app = new Hitchhiker();
  app.get("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("GET /at"); 
});
test("You can add POST routes", () => {
  const app = new Hitchhiker();
  app.post("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("POST /at"); 
});
test("You can add PUT routes", () => {
  const app = new Hitchhiker();
  app.put("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("PUT /at"); 
});
test("You can add DELETE routes", () => {
  const app = new Hitchhiker();
  app.delete("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("DELETE /at"); 
});
test("You can add PATCH routes", () => {
  const app = new Hitchhiker();
  app.patch("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("PATCH /at"); 
});
test("You can add HEAD routes", () => {
  const app = new Hitchhiker();
  app.head("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("HEAD /at"); 
});
test("You can add OPTIONS routes", () => {
  const app = new Hitchhiker();
  app.options("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("OPTIONS /at"); 
});
test("You can add CONNECT routes", () => {
  const app = new Hitchhiker();
  app.connect("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("CONNECT /at"); 
});
test("You can add TRACE routes", () => {
  const app = new Hitchhiker();
  app.trace("/at", () => new Response()); 
  expect(app.getRoutes()).toBeArray(); 
  expect(app.getRoutes()[0]).toBe("TRACE /at"); 
});
