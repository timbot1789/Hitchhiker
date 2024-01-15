import { Hitchhiker } from "./lib/hitchhiker";
import { IContext } from "./lib/interfaces";

const app = new Hitchhiker();

const PORT = 8080

async function getBase() {
  return new Response("Hello");
}

async function getHi() {
  return new Response("Hi");
}

async function getId({request}: IContext) {
  return new Response(`Route has ID of ${request.url.split("/").pop()}`);
}

async function getReadId({request}: IContext) {
  const splitArr = request.url.split("/");
  splitArr.pop();
  const id = splitArr.pop();
  return new Response(`Reading record with ID of ${id}`);
}
async function responseMiddleware(_ctx: IContext, next: () => Promise<Response>){
  const response = await next();
  const text = await response.text();
  return new Response(`${text}\n This response was modified by middleware`)
}

app.use("/hi", responseMiddleware).get("/hi/:id",getReadId).get("/hi", getHi).get("/", getBase).get("/:id", getId).get("/:id/article", getReadId).listen(PORT);
console.log(`App is running at URL ${app.url}`)
