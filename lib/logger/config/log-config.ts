import { LogLevel } from "../utils/log-level";
import { IRollingConfig, RollingConfig } from "./rolling-config";
export interface ILogConfig {
  level?: LogLevel;
  rolling_config?: RollingConfig;
  file_prefix?: string;
}

export class LogConfig {
  #level = LogLevel.Info;

  #rolling_config = RollingConfig.with_defaults();

  #file_prefix = "Logtar_";

  get level() {
    return this.#level;
  }

  get rolling_config(){
    return this.#rolling_config;
  }

  get file_prefix(){
    return this.#file_prefix;
  }

  static with_defaults() {
    return new LogConfig();
  }

  with_log_level(log_level: LogLevel) {
    if (!Object.values(LogLevel).includes(log_level)){
      throw new Error(`log_level must be an instance of LogLevel. Unsupported param ${JSON.stringify(log_level)}`);
    }
    this.#level = log_level;
    return this
  }

  with_file_prefix(file_prefix: string){
    this.#file_prefix = file_prefix;
    return this;
  }

  with_rolling_config(config: IRollingConfig) {
    this.#rolling_config = RollingConfig.from_json(config);
    return this;
  }

  static from_json(json: ILogConfig) {
    let log_config = new LogConfig();

    Object.keys(json).forEach((key) => {
      switch (key){
        case "level":
          log_config = log_config.with_log_level(json[key] ?? LogLevel.Debug);
          break;
        case "rolling_config":
          log_config = log_config.with_rolling_config(json[key] ?? RollingConfig.with_defaults());
          break;
        case "file_prefix":
          log_config = log_config.with_file_prefix(json[key] ?? "");
          break;
      }
    });

    return log_config;
  }

  static async from_file(file_path: string){
    const file = Bun.file(file_path);
    return LogConfig.from_json(JSON.parse(await file.text()));
  }
}
