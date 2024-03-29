import { expect, test, describe } from "bun:test";
import { RouteNode } from "lib/router/route-node";
import { HTTP_METHOD } from "lib/constants/enums";

const mockContext = () => {
  return {
    request: new Request("https://example.com/test"),
    set: {},
  };
};

describe("RouteNode tests", () => {
  test("you can insert and retrieve from the node", async () => {
    const node = new RouteNode();
    const path: string[] = [];
    node.insert(path, HTTP_METHOD.GET, () => new Response("test result"));
    const handler = node.findRoute(path, HTTP_METHOD.GET);
    const res = handler(mockContext());
    expect(await res.text()).toBe("test result");
  });
  test("you can add different route handlers for different HTTP methods", async () => {
    const node = new RouteNode();
    const path: string[] = [];
    node.insert(path, HTTP_METHOD.GET, () => new Response("get result"));
    node.insert(path, HTTP_METHOD.POST, () => new Response("post result"));
    const getHandler = node.findRoute(path, HTTP_METHOD.GET);
    const postHandler = node.findRoute(path, HTTP_METHOD.POST);
    const getBody = await getHandler(mockContext()).text();
    const postBody = await postHandler(mockContext()).text();
    expect(getBody).toBe("get result");
    expect(postBody).toBe("post result");
  });
  test("you can insert sub-routes", async () => {
    const node = new RouteNode();
    const path: string[] = ["test", "route"];
    node.insert(path, HTTP_METHOD.GET, () => new Response("get result"));
    const getHandler = node.findRoute(path, HTTP_METHOD.GET);
    const getBody = await getHandler(mockContext()).text();
    expect(getBody).toBe("get result");
  });
  test("it returns not found if the route doesn't exist", async () => {
    const node = new RouteNode();
    const path: string[] = ["test"];
    node.insert(
      ["false route"],
      HTTP_METHOD.GET,
      () => new Response("get result"),
    );
    const getHandler = node.findRoute(path, HTTP_METHOD.GET);
    const error = await getHandler(mockContext()).text();
    expect(error).toBe("Not Found");
  });
});
