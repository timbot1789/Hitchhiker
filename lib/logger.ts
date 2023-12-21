import { LogConfig } from "./config/log-config";
import { LogLevel } from "..";
import { FileSink } from "bun";
import { join } from "path";
import { check_and_create_dir } from "./utils/helpers";

export class Logger {
  #config;
  #log_file_handle: FileSink | undefined;

  constructor(log_config?: LogConfig) {
    this.#config = log_config ?? LogConfig.with_defaults();
  }

  get config() {
    return this.#config;
  }

  get level() {
    return this.#config.level;
  }

  get file_prefix() {
    return this.#config.file_prefix;
  }

  get time_threshold() {
    return this.#config.rolling_config.time_threshold;
  }

  get size_threshold() {
    return this.#config.rolling_config.size_threshold;
  }

  #log(message: string, log_level: number) {
    if (log_level < this.#config.level) {
      return;
    }
    if (!this.#log_file_handle) {
      // initialize log_file_handle
      const log_dir_path = check_and_create_dir("logs");
      const file_name = this.#config.file_prefix + new Date().toISOString().replace(/[\.:]+/g, "-") + ".log";
      // Unlike node, bun exposes a lazy-loading file interface. 
      // Bun.file(file_path) can point to a non-existent file 
      // (but will error if you try to read it)
      // You can create the file and open a writeable FileSink with 
      // Bun.file(file_path).writer()
      this.#log_file_handle = Bun.file(join(log_dir_path, file_name)).writer();
    }

    this.#log_file_handle.write(message);
    this.#log_file_handle.flush();
  }

  debug(message: string) {
    this.#log(message, LogLevel.Debug);
  }

  info(message: string) {
    this.#log(message, LogLevel.Info);
  }

  warn(message: string) {
    this.#log(message, LogLevel.Warn);
  }

  error(message: string) {
    this.#log(message, LogLevel.Error);
  }

  critical(message: string) {
    this.#log(message, LogLevel.Critical);
  }

  init() {
    const log_dir_path = check_and_create_dir("logs");
    const file_name = this.#config.file_prefix + new Date().toISOString().replace(/[\.:]+/g, "-") + ".log";
    // Unlike node, bun exposes a lazy-loading file interface. 
    // Bun.file(file_path) can point to a non-existent file 
    // (but will error if you try to read it)
    // You can create the file and open a writeable FileSink with 
    // Bun.file(file_path).writer()
    this.#log_file_handle = Bun.file(join(log_dir_path, file_name)).writer();
  }

  static with_config(log_config: LogConfig) {
    return new Logger(log_config);
  }
}
