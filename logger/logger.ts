import { LogConfig } from "./config/log-config";
import { LogLevel } from "..";
import { FileSink } from "bun";
import { join } from "path";
import { check_and_create_dir, get_caller_info } from "./utils/helpers";

export class Logger {
  #config;
  #log_file_handle: FileSink | undefined;
  #log_opening_time: number | undefined;
  #current_file_name: string | undefined;

  async #rolling_check() {
    const { time_threshold, size_threshold } = this.#config.rolling_config;
    const current_time = new Date().getTime();
    const size = this.#current_file_name
      ? Bun.file(this.#current_file_name).size
      : 0;

    // Additional validations to handle the case where #log_file_handle
    // hasn't been initialized yet
    if (
      this.#log_opening_time &&
      this.#log_file_handle &&
      (size >= size_threshold ||
        current_time - this.#log_opening_time >= time_threshold * 1000)
    ) {
      await this.#log_file_handle.end();
      this.init();
    }
  }

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

  async #write_to_handle(
    message: string,
    log_level: number,
    log_file_handle: FileSink,
  ) {
    const date_iso = new Date().toISOString();
    const log_level_string = LogLevel.to_string(log_level);
    const log_message = `[${date_iso}] [${log_level_string}]: ${get_caller_info()} ${message}\n`;
    log_file_handle.write(log_message);
    await log_file_handle.flush();
  }

  async #log(message: string, log_level: number) {
    if (log_level < this.#config.level) {
      return;
    }
    if (!this.#log_file_handle) {
      // initialize log_file_handle
      const log_dir_path = check_and_create_dir("logs");
      const file_name =
        this.#config.file_prefix +
        new Date().toISOString().replace(/[.:]+/g, "-") +
        ".log";
      this.#current_file_name = file_name;
      this.#log_file_handle = Bun.file(join(log_dir_path, file_name)).writer();
    }
    this.#write_to_handle(message, log_level, this.#log_file_handle);
    await this.#rolling_check();
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
    const file_name =
      this.#config.file_prefix +
      new Date().toISOString().replace(/[.:]+/g, "-") +
      ".log";
    this.#current_file_name = file_name;
    // Unlike node, bun exposes a lazy-loading file interface.
    // Bun.file(file_path) can point to a non-existent file
    // (but will error if you try to read it)
    // You can create the file and open a writeable FileSink with
    // Bun.file(file_path).writer()
    this.#log_file_handle = Bun.file(join(log_dir_path, file_name)).writer();
    this.#log_opening_time = new Date().getTime();
  }

  static with_config(log_config: LogConfig) {
    return new Logger(log_config);
  }
}
