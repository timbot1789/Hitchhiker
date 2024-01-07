class RouteNode {
  #children: {
    [key: string]: RouteNode
  } = {};
  #handler: (() => unknown) | null = null;

  insert(pathSegments: string[], handler: () => unknown) {
    if (pathSegments.length < 1) {
      this.#handler = handler;
      return;
    }
    const nodeVal = pathSegments.shift() as string;
    if (!this.#children[nodeVal]){
      this.#children[nodeVal] = new RouteNode();
    }

    this.#children[nodeVal].insert(pathSegments, handler);
  }

  findRoute(pathSegments: string[]): (() => unknown) | null  {
    if (pathSegments.length < 1) {
      return this.#handler;
    }

    const nodeVal = pathSegments.shift() as string;
    if (this.#children[nodeVal]){
      return this.#children[nodeVal].findRoute(pathSegments);
    }
    return null;
  }

  getRoutes(partial: string = ''){
    let words: string[] = [];
    if (this.#handler){
      words.push(partial);
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

  addRoute(path: string, handler: () => unknown) {
    const processedRoute = TrieRouter.processRouteString(path)
    this.#root.insert(processedRoute, handler);
  }

  findRoute(path: string): (() => unknown) | null {
    const processedRoute = TrieRouter.processRouteString(path)
    return this.#root.findRoute(processedRoute);
  }

  getRoutes(){
    return this.#root.getRoutes();
  }
}

const router = new TrieRouter();
function ref() {}
router.addRoute("/home/", ref);
console.log("Router should have home route", router.getRoutes());
router.addRoute("/    user", ref);
console.log("Router should have user route", router.getRoutes());
router.addRoute("/    user/ status/play", ref);
console.log("Router should have user/status/play route", router.getRoutes());
