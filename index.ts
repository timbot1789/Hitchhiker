export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Critical = 4
}

export enum RollingSizeOptions {
  OneKB = 1024,
  FiveKB = 5 * 1024,
  TenKB = 10 * 1024,
  TwentyKB = 20 * 1024,
  FiftyKB = 50 * 1024,
  HundredKB = 100 * 1024,
  HalfMB = 512 * 1024,
  OneMB = 1024*1024,
  FiveMB = 5 * 1024 * 1024,
  TenMB = 10 * 1024 * 1024,
  TwentyMB = 20 * 1024 * 1024,
  FiftyMB = 50 * 1024 * 1024,
  HundredMB = 100 * 1024 * 1024
}

export enum RollingTimeOptions {
  Minutely = 60,
  Hourly = 60 * 60,
  Daily = 24 * 60 * 60,
  Weekly = 7 * 24 * 60 * 60,
  Monthly = 4 * 7 * 24 * 60 * 60,
  Yearly = 365 * 24 * 60 * 60
}

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

export interface IRollingConfig {
  time_threshold?: RollingTimeOptions;
  size_threshold?: RollingSizeOptions;
}

export class RollingConfig implements IRollingConfig {
  #time_threshold = RollingTimeOptions.Hourly;
  #size_threshold = RollingSizeOptions.FiveMB;

  static with_defaults(){
    return new RollingConfig();
  }

  with_size_threshold(size_threshold: RollingSizeOptions){
    if (!Object.values(RollingSizeOptions).includes(size_threshold)){
      throw new Error(`size_threshold must be an instance of RollingSizeOptions. Unsupported param ${JSON.stringify(size_threshold)}`);
    }
    this.#size_threshold = size_threshold;
    return this;
  }

  with_time_threshold(time_threshold: RollingTimeOptions){
    if (!Object.values(RollingTimeOptions).includes(time_threshold)){
      throw new Error(`time_threshold must be an instance of RollingTimeOptions. Unsupported param ${JSON.stringify(time_threshold)}`);
    }
    this.#time_threshold = time_threshold;
    return this;
  }

  static from_json(json: IRollingConfig){
    let rolling_config = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "size_threshold":
          rolling_config = rolling_config.with_size_threshold(json[key] ?? RollingSizeOptions.FiveMB);
          break;
        case "time_threshold":
          rolling_config = rolling_config.with_time_threshold(json[key] ?? RollingTimeOptions.Hourly);
          break;
      }
    });
    return rolling_config;
  }

  get time_threshold() {
    return this.#time_threshold;
  }

  get size_threshold() {
    return this.#size_threshold;
  }
}

