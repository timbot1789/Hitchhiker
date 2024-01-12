import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "lib/interfaces";

export class RouteNode {
  #children: {
    [key: string]: RouteNode;
  } = {};
  #handlers: Map<HTTP_METHOD, (context?: IContext) => Response> = new Map();

  insert(
    pathSegments: string[],
    method: HTTP_METHOD,
    handler: (context?: IContext) => Response,
  ) {
    if (pathSegments.length < 1) {
      this.#handlers.set(method, handler);
      return this;
    }
    const nodeVal = pathSegments[0];
    if (!this.#children[nodeVal]) {
      this.#children[nodeVal] = new RouteNode();
    }

    this.#children[nodeVal].insert(
      pathSegments.toSpliced(0, 1),
      method,
      handler,
    );
    return this;
  }

  findRoute(
    pathSegments: string[],
    method: HTTP_METHOD,
  ): (context?: IContext) => Response {
    console.log(`finding path ${pathSegments}`);
    if (pathSegments.length < 1) {
      return (
        this.#handlers.get(method) ??
        (() => new Response("Not Found", { status: 404 }))
      );
    }

    const nodeVal = pathSegments[0];
    if (this.#children[nodeVal]) {
      console.log(`getting child ${nodeVal}`);
      return this.#children[nodeVal].findRoute(
        pathSegments.toSpliced(0, 1),
        method,
      );
    }
    return () => new Response("Not Found", { status: 404 });
  }
}
