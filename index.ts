export * from "./lib/logtar.ts"

const PORT = 5255;

class Router {
  #routes: {
    [key: string]: (request: Request) => Response | void
  } = {};

  constructor() {
    this.#routes = {}
  }

  handleRequest(request: Request) {
    const method = request.method;
    const url = new URL(request.url);
    const handler = this.#routes[`${method} ${url.pathname}`];
    if (!handler) {
      return new Response("Not Found", {status: 404});
    }
    return handler(request);
  }

  addRoute(method: string, path: string, handler: () => Response | void) {
    this.#routes[`${method} ${path}`] = handler;
  }

  printRoutes(){
    console.log(Object.entries(this.#routes));
  }
}
function handleGetBasePath(){
  return new Response("Hello World", {status: 200});
}
function handlePostBasePath(){
  return new Response("Hello POST", {status: 201});
}
const router = new Router();
router.addRoute('GET', '/', handleGetBasePath);

router.addRoute('POST', '/', handlePostBasePath); 

Bun.serve(
  {
    port: PORT,
    development: true,
    fetch(req) {
      return router.handleRequest(req);
    }
  }
);

console.log(`Server is running on port ${PORT}`);
