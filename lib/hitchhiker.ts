import { TrieRouter } from "lib/router/trie-router";
import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "./interfaces";
import { Server } from "bun";

function validateHttpMethod(method: string): HTTP_METHOD {
  const res = Object.values(HTTP_METHOD).find(
    (value) => method === HTTP_METHOD[value],
  );
  if (!res) {
    throw Error("Not a valid HTTP Method");
  }
  return HTTP_METHOD[res];
}

export class Hitchhiker {
  #router: TrieRouter;
  #server: Server | null = null;

  constructor() {
    this.#router = new TrieRouter();
  }

  #handleRequest(request: Request): Response {
    const method = request.method as HTTP_METHOD;
    const validMethod = validateHttpMethod(method);
    const url = new URL(request.url);
    const handler = this.#router.findRoute(url, validMethod);
    if (!handler) {
      return new Response("Not Found", { status: 404 });
    }
    const context: IContext = {
      request,
      set: {},
    };
    try {
      return handler(context);
    } catch (e: unknown) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  #addRoute(
    method: HTTP_METHOD,
    path: string | URL,
    handler: (context: IContext) => Response,
  ) {
    this.#router.addRoute(path, method, handler);
    return this;
  }

  get(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.GET, path, handler);
  }
  post(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.POST, path, handler);
  }
  put(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.PUT, path, handler);
  }
  delete(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.DELETE, path, handler);
  }
  patch(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.PATCH, path, handler);
  }
  head(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.HEAD, path, handler);
  }
  options(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.OPTIONS, path, handler);
  }
  connect(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.CONNECT, path, handler);
  }
  trace(path: string | URL, handler: (context: IContext) => Response) {
    return this.#addRoute(HTTP_METHOD.TRACE, path, handler);
  }
  use() // path: string | URL,
  // handler: (context: IContext) => Response,
  : Hitchhiker {
    // TODO
    return this;
  }

  listen(port: number): Hitchhiker {
    this.#server = Bun.serve({
      port: port,
      fetch: (req) => {
        return this.#handleRequest(req);
      },
    });
    return this;
  }
  stop(): Hitchhiker {
    if (!this.#server) {
      return this;
    }

    this.#server.stop();
    return this;
  }
}
