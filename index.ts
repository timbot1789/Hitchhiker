export * from "./lib/logtar.ts"

const PORT = 5255;

enum HTTP_METHODS {
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

  #addRoute(method: string, path: string, handler: (request?: Request) => Response | void) {
    this.#routes[`${method} ${path}`] = handler;
  }

  get(path: string, handler: (request?: Request) => Response) {
    this.#addRoute(HTTP_METHODS.GET, path, handler);
  }
  post(path: string, handler: (request?: Request) => Response) {
    this.#addRoute(HTTP_METHODS.POST, path, handler);
  }
  put(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.PUT, path, handler);
  }
  delete(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.DELETE, path, handler);
  }
  patch(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.PATCH, path, handler);
  }
  head(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.HEAD, path, handler);
  }
  options(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.OPTIONS, path, handler);
  }
  connect(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.CONNECT, path, handler);
  }
  trace(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHODS.TRACE, path, handler);
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
router.get('GET', handleGetBasePath);

router.post('POST', handlePostBasePath); 

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
