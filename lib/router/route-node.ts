import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "lib/interfaces";

enum SPECIAL_CHILD {
  DYNAMIC = "|dynamic",
}

export class RouteNode {
  #children: Map<string | SPECIAL_CHILD, RouteNode> = new Map();
  #handlers: Map<HTTP_METHOD, (context: IContext) => Response> = new Map();

  insert(
    pathSegments: string[],
    method: HTTP_METHOD,
    handler: (context: IContext) => Response,
  ) {
    if (pathSegments.length < 1) {
      this.#handlers.set(method, handler);
      return this;
    }
    let nodeVal: string | SPECIAL_CHILD = pathSegments[0];
    nodeVal = nodeVal[0] === ":" ? SPECIAL_CHILD.DYNAMIC : nodeVal;
    if (!this.#children.get(nodeVal)) {
      this.#children.set(nodeVal, new RouteNode());
    }

    this.#children
      .get(nodeVal)
      ?.insert(pathSegments.toSpliced(0, 1), method, handler);
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

    const nodeVal = pathSegments[0];
    const node = this.#children.get(nodeVal);
    if (node) {
      return node.findRoute(pathSegments.toSpliced(0, 1), method);
    }
    const dynamicRoute = this.#children.get(SPECIAL_CHILD.DYNAMIC);
    if (dynamicRoute) {
      return dynamicRoute.findRoute(pathSegments.toSpliced(0, 1), method);
    }
    return () => new Response("Not Found", { status: 404 });
  }
}
