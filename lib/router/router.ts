import { TrieRouter } from "./trie-router";
import { HTTP_METHOD } from "./enums";

function validateHttpMethod(method: string): HTTP_METHOD {
  const res = Object.values(HTTP_METHOD).find((value) => method === HTTP_METHOD[value]);
  if (!res) {
    throw Error("Not a valid HTTP Method");
  }
  return HTTP_METHOD[res]
}

export class Router {
  #trieRouter: TrieRouter;

  constructor() {
    this.#trieRouter = new TrieRouter();
  }

  handleRequest(request: Request) {
    const method = request.method as HTTP_METHOD;
    const validMethod = validateHttpMethod(method);
    const url = new URL(request.url);
    const handler = this.#trieRouter.findRoute(url, validMethod);
    if (!handler) {
      return new Response("Not Found", {status: 404});
    }
    return handler(request);
  }

  #addRoute(method: HTTP_METHOD, path: string, handler: (request?: Request) => Response | void) {
    this.#trieRouter.addRoute(path, handler, method);
  }

  get(path: string, handler: (request?: Request) => Response) {
    this.#addRoute(HTTP_METHOD.GET, path, handler);
  }
  post(path: string, handler: (request?: Request) => Response) {
    this.#addRoute(HTTP_METHOD.POST, path, handler);
  }
  put(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.PUT, path, handler);
  }
  delete(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.DELETE, path, handler);
  }
  patch(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.PATCH, path, handler);
  }
  head(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.HEAD, path, handler);
  }
  options(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.OPTIONS, path, handler);
  }
  connect(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.CONNECT, path, handler);
  }
  trace(path: string, handler: (request?: Request) => Response){
    this.#addRoute(HTTP_METHOD.TRACE, path, handler);
  }

  getRoutes(){
    return this.#trieRouter.getRoutes();
  }
}

