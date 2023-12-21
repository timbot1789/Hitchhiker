import { LogConfig } from "./config/log-config";

export class Logger {
  #config;

  constructor(log_config?: LogConfig) {
    this.#config = log_config ?? LogConfig.with_defaults();
  }

  get config() {
    return this.#config;
  }

  static with_config(log_config: LogConfig) {
    return new Logger(log_config);
  }
}
