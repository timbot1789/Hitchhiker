import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "lib/interfaces";
import { RouteNode } from "./route-node";

export class TrieRouter {
  #root: RouteNode;

  constructor() {
    this.#root = new RouteNode();
  }

  static processRouteString(path: string | URL): string[] {
    const pathString = typeof path === "string" ? path : path.pathname;
    if (pathString.charAt(0) !== "/") {
      throw new Error("pathStrings must begin with a / ");
    }
    const pathStringSegments = pathString.split("/");
    const cleanedSegments = pathStringSegments
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0);
    const normalizedSegments = cleanedSegments.map((segment) => {
      if (segment.charAt(0) === ":") {
        return segment;
      }
      return segment.toLowerCase();
    });
    return normalizedSegments;
  }

  addRoute(
    path: string | URL,
    method: HTTP_METHOD,
    handler: (context?: IContext) => Response,
  ) {
    const processedRoute = TrieRouter.processRouteString(path);
    this.#root.insert(processedRoute, method, handler);
    return this;
  }

  findRoute(
    path: string | URL,
    method: HTTP_METHOD,
  ): (context?: IContext) => Response {
    const guardedPath = path instanceof URL ? path.pathname : path;
    const processedRoute = TrieRouter.processRouteString(guardedPath);
    return this.#root.findRoute(processedRoute, method);
  }
}
