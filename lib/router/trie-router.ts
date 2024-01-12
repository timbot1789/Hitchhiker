import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "lib/interfaces";

class RouteNode {
  #children: {
    [key: string]: RouteNode;
  } = {};
  #handlers: Map<HTTP_METHOD, (context: IContext) => Response> = new Map();

  insert(
    pathSegments: string[],
    handler: (context: IContext) => Response,
    method: HTTP_METHOD,
  ) {
    if (pathSegments.length < 1) {
      this.#handlers.set(method, handler);
      return;
    }
    const nodeVal = pathSegments.shift() as string;
    if (!this.#children[nodeVal]) {
      this.#children[nodeVal] = new RouteNode();
    }

    this.#children[nodeVal].insert(pathSegments, handler, method);
  }

  findRoute(
    pathSegments: string[],
    method: HTTP_METHOD,
  ): (context: IContext) => Response {
    if (pathSegments.length < 1) {
      return (
        this.#handlers.get(method) ??
        (() => new Response("Not Found", { status: 404 }))
      );
    }

    const nodeVal = pathSegments.shift() as string;
    if (this.#children[nodeVal]) {
      return this.#children[nodeVal].findRoute(pathSegments, method);
    }
    return () => new Response("Not Found", { status: 404 });
  }

  getRoutes(partial: string = "") {
    let words: string[] = [];
    for (const method of this.#handlers.keys()) {
      words.push(`${method} ${partial}`);
    }
    for (const val in this.#children) {
      const newWords: string[] = this.#children[val].getRoutes(
        partial.concat(`/${val}`),
      );
      if (words) words = words.concat(newWords);
    }
    return words;
  }
}

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
    handler: (context: IContext) => Response,
    method: HTTP_METHOD,
  ) {
    const processedRoute = TrieRouter.processRouteString(path);
    this.#root.insert(processedRoute, handler, method);
  }

  findRoute(
    path: string | URL,
    method: HTTP_METHOD,
  ): ((context: IContext) => Response) | null {
    const guardedPath = path instanceof URL ? path.pathname : path;
    const processedRoute = TrieRouter.processRouteString(guardedPath);
    return this.#root.findRoute(processedRoute, method);
  }

  getRoutes() {
    return this.#root.getRoutes();
  }
}
