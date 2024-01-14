import { HTTP_METHOD } from "lib/constants/enums";
import { IContext } from "lib/interfaces";
import { compose } from "./compose";

enum SPECIAL_CHILD {
  DYNAMIC,
}

export class RouteNode {
  #children: Map<string | SPECIAL_CHILD, RouteNode> = new Map();
  #handlers: Map<HTTP_METHOD, (context: IContext) => Promise<Response>> = new Map();
  #middleware: ((context: IContext, next: () => void) => Promise<unknown>)[] = [];

  insert(
    pathSegments: string[],
    method: HTTP_METHOD,
    handler: (context: IContext) => Promise<Response>,
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
  ): (context: IContext) => Promise<Response> {
    let func;
    if (pathSegments.length < 1) {
      func =
        this.#handlers.get(method) ??
        (async () => new Response("Not Found", { status: 404 }));
    } else {
    
    const nodeVal = pathSegments[0];
    const node = this.#children.get(nodeVal) ?? this.#children.get(SPECIAL_CHILD.DYNAMIC);
    if (node) {
      func = node.findRoute(pathSegments.toSpliced(0, 1), method);
    }
    func = async () => new Response("Not Found", { status: 404 });
    }
    return compose(this.#middleware.toSpliced(this.#middleware.length, 0, func));
  }

  addMiddleware(pathSegments: string[], handler: (context: IContext, next: () => void) => Promise<unknown>){
    if (pathSegments.length < 1) {
      this.#middleware.push(handler);
      return this;
    }

    let nodeVal: string | SPECIAL_CHILD = pathSegments[0];
    nodeVal = nodeVal[0] === ":" ? SPECIAL_CHILD.DYNAMIC : nodeVal;

    this.#children
      .get(nodeVal)
      ?.addMiddleware(pathSegments.toSpliced(0, 1), handler);
  }
}
