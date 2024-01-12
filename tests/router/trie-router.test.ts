import { expect, test, describe, beforeEach } from "bun:test";
import { HTTP_METHOD } from "lib/constants/enums";
import { TrieRouter } from "lib/router/trie-router";

const mockContext = () => {
  return {
    request: new Request("https://example.com/test"),
    set: {},
  };
};

describe("TrieRouter tests", () => {
  let router: TrieRouter;
  beforeEach(() => {
    router = new TrieRouter();
  });
  test("you can add routes as strings", async () => {
    const path: string = "/here";
    router.addRoute(path, HTTP_METHOD.GET, () => new Response("test result"));
    const handler = router.findRoute(path, HTTP_METHOD.GET);
    const res = handler(mockContext());
    expect(await res.text()).toBe("test result");
  });
  test("you can add routes as URLS", async () => {
    const path: string = "/here";
    const baseRoute: string = "https://example.com";
    router.addRoute(
      new URL(path, baseRoute),
      HTTP_METHOD.GET,
      () => new Response("test result"),
    );
    const handler = router.findRoute(new URL(path, baseRoute), HTTP_METHOD.GET);
    const res = handler(mockContext());
    expect(await res.text()).toBe("test result");
  });
  test("you can mix and match strings and URLS", async () => {
    const path: string = "/here";
    const baseRoute: string = "https://example.com";
    router.addRoute(
      new URL(path, baseRoute),
      HTTP_METHOD.GET,
      () => new Response("test result"),
    );
    const handler = router.findRoute(path, HTTP_METHOD.GET);
    const res = handler(mockContext());
    expect(await res.text()).toBe("test result");
  });
  test("you can nest routes", async () => {
    const indexPath: string = "/idx";
    const leafPath: string = "/idx/here";
    const baseRoute: string = "https://example.com";
    router
      .addRoute(
        new URL(indexPath, baseRoute),
        HTTP_METHOD.GET,
        () => new Response("index response"),
      )
      .addRoute(
        new URL(leafPath, baseRoute),
        HTTP_METHOD.GET,
        () => new Response("leaf response"),
      );
    const indexHandler = router.findRoute(indexPath, HTTP_METHOD.GET);
    const leafHandler = router.findRoute(leafPath, HTTP_METHOD.GET);
    const indexResponse = await indexHandler(mockContext()).text();
    const leafResponse = await leafHandler(mockContext()).text();
    expect(indexResponse).toBe("index response");
    expect(leafResponse).toBe("leaf response");
  });
  test("you can add dynamic routes", async () => {
    const dynamicPath: string = "/:id";
    router.addRoute(
      dynamicPath,
      HTTP_METHOD.GET,
      ({ request }) =>
        new Response(`Received request for dynamic path ${request.url}`),
    );
    const handler = router.findRoute("/10", HTTP_METHOD.GET);
    const response = await handler(mockContext()).text();
    expect(response).toBe("Received request for dynamic path 10");
  });
});
