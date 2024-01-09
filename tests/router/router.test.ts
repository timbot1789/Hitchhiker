import { expect, test } from "bun:test";
import { Router } from "../../lib/router/router";

test("You can add GET routes", () => {
  const router = new Router();
  router.get("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("GET /at"); 
});
test("You can add POST routes", () => {
  const router = new Router();
  router.post("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("POST /at"); 
});
test("You can add PUT routes", () => {
  const router = new Router();
  router.put("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("PUT /at"); 
});
test("You can add DELETE routes", () => {
  const router = new Router();
  router.delete("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("DELETE /at"); 
});
test("You can add PATCH routes", () => {
  const router = new Router();
  router.patch("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("PATCH /at"); 
});
test("You can add HEAD routes", () => {
  const router = new Router();
  router.head("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("HEAD /at"); 
});
test("You can add OPTIONS routes", () => {
  const router = new Router();
  router.options("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("OPTIONS /at"); 
});
test("You can add CONNECT routes", () => {
  const router = new Router();
  router.connect("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("CONNECT /at"); 
});
test("You can add TRACE routes", () => {
  const router = new Router();
  router.trace("/at", () => new Response()); 
  expect(router.getRoutes()).toBeArray(); 
  expect(router.getRoutes()[0]).toBe("TRACE /at"); 
});
