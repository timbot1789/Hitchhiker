import { IContext, HandlerSignature } from "lib/interfaces"


export function compose (middleware: HandlerSignature[], defaultHandler: () => Promise<Response>): (context: IContext) => Promise<Response>{

  return function (context: IContext) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    async function dispatch(i: number): Promise<Response> {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i;
      const fn: HandlerSignature = middleware[i];
      if (i === (middleware.length - 1)) {
        return await fn(context, defaultHandler);
      }
      try {
        return await fn(context, dispatch.bind(null, i + 1));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

