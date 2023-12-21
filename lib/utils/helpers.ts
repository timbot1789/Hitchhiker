import { resolve, dirname } from "path";
import { existsSync, mkdirSync } from "fs";

// As of the time of creation, Bun's file I/O library does not include
// directory manipulation.
// We will use it's reimplementation of node's fs module for now
export function check_and_create_dir(path_to_dir: string) {
  const log_dir = resolve(dirname(Bun.main), path_to_dir);
  if (!existsSync(log_dir)){
    mkdirSync(log_dir, { recursive: true });
  }

  return log_dir;
}

export function get_caller_info(): string {
  const error: { stack?: string } = {};
  Error.captureStackTrace(error);

  const caller_frame = error.stack?.split("\n")[9];

  const meta_data = caller_frame?.split("at ").pop() || "";
  return meta_data;
}
