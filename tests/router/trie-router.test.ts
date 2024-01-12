import { expect, test, describe, beforeEach } from "bun:test";
import { HTTP_METHOD } from "lib/constants/enums";
import { TrieRouter } from "lib/router/trie-router";

describe("TrieRouter tests", () => {
  let router: TrieRouter;
  beforeEach(() => {
    router = new TrieRouter();
  });
  test("you can add routes as strings", async () => {
    const path: string = "/here";
    router.addRoute(path, HTTP_METHOD.GET, () => new Response("test result"));
    const handler = router.findRoute(path, HTTP_METHOD.GET);
    const res = handler();
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
    const res = handler();
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
    const res = handler();
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
    const indexResponse = await indexHandler().text();
    const leafResponse = await leafHandler().text();
    expect(indexResponse).toBe("index response");
    expect(leafResponse).toBe("leaf response");
  });
});
