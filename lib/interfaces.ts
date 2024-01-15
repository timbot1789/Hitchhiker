export type HandlerSignature = (context: IContext, next: () => Promise<Response>) => Promise<Response>

export interface IContext {
  request: Request;
  res?: Response | unknown;
  set: {
    status?: number;
    headers?: object;
    redirect?: string;
  };
}
