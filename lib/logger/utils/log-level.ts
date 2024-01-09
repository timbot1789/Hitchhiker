export class LogLevel {
  static Debug = 0;
  static Info = 1;
  static Warn = 2;
  static Error = 3;
  static Critical = 4;

  static to_string(log_level: number): string {
    const levelMap = {
      [this.Debug]: "DEBUG",
      [this.Info]: "INFO",
      [this.Warn]: "WARN",
      [this.Error]: "ERROR",
      [this.Critical]: "CRITICAL"
    }

    if (levelMap.hasOwnProperty(log_level)) {
      return levelMap[log_level];
    }

    throw new Error (`Unsupported log level ${log_level}`)
  }
}
