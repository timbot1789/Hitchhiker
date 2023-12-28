export * from "./lib/logtar.ts"

const PORT = 5255;

const initBaseHeaders = (): Headers => {
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");
  return headers
};

const getRouteHandler = (route: string): () => Response => {
  switch (route) {
  case "GET /": 
    return () => {
      const status = 200;
      const data = "Hello World!";
      const headers = initBaseHeaders(); 
      headers.append("My-Header", "Hello World");
      return new Response(data, {status, headers});
    }
  case "POST /echo": 
    return () => {
      const status = 201;
      const data = "Yellow World!";
      const headers = initBaseHeaders(); 
      headers.append("My-Header", "Yellow World!");
      return new Response(data, {status, headers});
    }
  default:
    return () => {
      const status = 404;
      const data = "Not Found";
      const headers = initBaseHeaders();
      return new Response(data, {status, headers});
    }
  }
};

function handleRequest(request: Request) {
  const method = request.method;
  const url = new URL(request.url);
  const pathname = url.pathname
  return getRouteHandler(`${method} ${pathname}`)(); 
}

Bun.serve(
  {
    port: PORT,
    development: true,
    fetch(req) {
      return handleRequest(req);
    }
  }
);
console.log(`Server is running on port ${PORT}`);
