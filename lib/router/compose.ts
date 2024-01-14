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

function responseFunction() {
  return "this is a response function";
}

function responseFunctionWithContext(ctx: IContext) {
  return `This is the response function that received ${ctx.request.url}`;
}
async function firstMiddleware(ctx: IContext, next: () => Promise<unknown>){
  console.log("first middleware");
  ctx.request = new Request("http://modified.com");
  await next();
  console.log("First middleware exit");
}
async function secondMiddleware(_ctx: IContext, next: () => Promise<unknown>){
  console.log("second middleware");
  await next();
  console.log("second middleware exit");
}
const middleware = [firstMiddleware, secondMiddleware, responseFunctionWithContext];
const composed = compose(middleware);
console.log(composed);
const context ={request: new Request("http://example.com"), set: {}}
const result = await composed(context);
console.log("The return value is", result);
console.log(context);
