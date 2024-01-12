export interface IContext {
  request: Request;
  set: {
    status?: number;
    headers?: object;
    redirect?: string;
  };
}
