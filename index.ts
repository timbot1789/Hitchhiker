import { Hitchhiker } from "lib/hitchhiker";

const app = new Hitchhiker();

const PORT = 8080

function getBase() {
  return new Response("Hello");
}

function getHi() {
  return new Response("Hi");
}

app.get("/", getBase).get("/hi", getHi).listen(PORT);
