import { IContext } from "lib/interfaces"

export function compose (middleware: ((context: IContext, next: () => Promise<Response | void>) => unknown)[]): (context: IContext) => Promise<Response>{

  return function (context: IContext) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    async function dispatch(i: number): Promise<Response> {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i;
      const fn: ((context: IContext, next: () => Promise<Response | void>) => unknown) = middleware[i];
      if (i === (middleware.length - 1)) {
        const res = await fn(context, async () => {}) as Response;
        context.res = res;
        return res;
      }
      try {
        await fn(context, dispatch.bind(null, i + 1));
        return context.res as Response;
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

