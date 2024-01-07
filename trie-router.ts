enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  CONNECT = "CONNECT",
  TRACE = "TRACE"
}

class RouteNode {
  #children: {
    [key: string]: RouteNode
  } = {};
  #handlers:  Map<HTTP_METHOD, () => unknown> = new Map();

  insert(pathSegments: string[], handler: () => unknown, method: HTTP_METHOD) {
    if (pathSegments.length < 1) {
      this.#handlers.set(method, handler);
      return;
    }
    const nodeVal = pathSegments.shift() as string;
    if (!this.#children[nodeVal]){
      this.#children[nodeVal] = new RouteNode();
    }

    this.#children[nodeVal].insert(pathSegments, handler, method);
  }

  findRoute(pathSegments: string[], method: HTTP_METHOD): (() => unknown) | null  {
    if (pathSegments.length < 1) {
      return this.#handlers.get(method) ?? null;
    }

    const nodeVal = pathSegments.shift() as string;
    if (this.#children[nodeVal]){
      return this.#children[nodeVal].findRoute(pathSegments, method);
    }
    return null;
  }

  getRoutes(partial: string = ''){
    let words: string[] = [];
    for (const method of this.#handlers.keys()) {
      words.push(`${method} ${partial}`);
    }
    for (const val in this.#children) {
      const newWords: string[] = this.#children[val].getRoutes(partial.concat(`/${val}`));
      if (words) words = words.concat(newWords);
    }
    return words;
  }
}

class TrieRouter {
  #root: RouteNode

  constructor() {
    this.#root = new RouteNode();
  }

  static processRouteString(path: string): string[]{
    if (path.charAt(0) !== '/') {
      throw new Error("paths must begin with a / ");
    }
    const pathSegments = path.split('/');
    return pathSegments.map(
      (segment) => segment.trim()
    ).filter(
        (segment) => segment.length > 0
    );
  }

  addRoute(path: string, handler: () => unknown, method: HTTP_METHOD) {
    const processedRoute = TrieRouter.processRouteString(path)
    this.#root.insert(processedRoute, handler, method);
  }

  findRoute(path: string, method: HTTP_METHOD): (() => unknown) | null {
    const processedRoute = TrieRouter.processRouteString(path)
    return this.#root.findRoute(processedRoute, method);
  }

  getRoutes(){
    return this.#root.getRoutes();
  }
}

const router = new TrieRouter();
function get() {}
function put() {}
router.addRoute("/home/", get, HTTP_METHOD.GET);
console.log("Router should have home route", router.getRoutes());
router.addRoute("/home/", put, HTTP_METHOD.PUT);
console.log("Router should have 2 home routes", router.getRoutes());
console.log("findRoute should find home GET method", router.findRoute("/home/", HTTP_METHOD.GET));
console.log("findRoute should find home PUT method", router.findRoute("/home/", HTTP_METHOD.PUT));
router.addRoute("/    user", get, HTTP_METHOD.GET);
console.log("Router should have user route", router.getRoutes());
router.addRoute("/    user/ status/play", put, HTTP_METHOD.GET);
console.log("Router should have user/status/play route", router.getRoutes());
