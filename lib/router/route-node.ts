import { HTTP_METHOD } from "lib/constants/enums";
import { HandlerSignature, IContext } from "lib/interfaces";
import { compose } from "./compose";

enum SPECIAL_CHILD {
  DYNAMIC,
}

export class RouteNode {
  #children: Map<string | SPECIAL_CHILD, RouteNode> = new Map();
  #handlers: Map<HTTP_METHOD, (context: IContext) => Promise<Response>> =
    new Map();
  #middleware: ((
    context: IContext,
    next: () => Promise<Response>,
  ) => Promise<Response>)[] = [];

  insert(
    pathSegments: string[],
    method: HTTP_METHOD,
    handler: (context: IContext) => Promise<Response>,
  ) {
    if (pathSegments.length < 1) {
      if (this.#handlers.get(method)) {
        throw new Error(
          `Route has more than one ${method} method. Handler ${handler} cannot be added.`,
        );
      }
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
  ): (context: IContext) => Promise<Response> {
    const defaultFunction = async () =>
      new Response("Not Found", { status: 404 });
    let func: HandlerSignature = defaultFunction;
    if (pathSegments.length < 1 && this.#handlers.get(method)) {
      func = this.#handlers.get(method) as HandlerSignature;
    } else {
      const nodeVal = pathSegments[0];
      const node =
        this.#children.get(nodeVal) ??
        this.#children.get(SPECIAL_CHILD.DYNAMIC);
      if (node) {
        func = node.findRoute(pathSegments.toSpliced(0, 1), method);
      }
    }
    return compose(
      this.#middleware.toSpliced(this.#middleware.length, 0, func),
      defaultFunction,
    );
  }

  addMiddleware(pathSegments: string[], handler: HandlerSignature) {
    if (pathSegments.length < 1) {
      this.#middleware.push(handler);
      return this;
    }

    let nodeVal: string | SPECIAL_CHILD = pathSegments[0];
    nodeVal = nodeVal[0] === ":" ? SPECIAL_CHILD.DYNAMIC : nodeVal;
    if (!this.#children.get(nodeVal)) {
      this.#children.set(nodeVal, new RouteNode());
    }

    this.#children
      .get(nodeVal)
      ?.addMiddleware(pathSegments.toSpliced(0, 1), handler);
  }
}
