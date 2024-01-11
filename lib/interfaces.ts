export interface IContext {
  request: Request;
  set: {
    status?: number;
    headers?: {};
    redirect?: string;
  };
}
