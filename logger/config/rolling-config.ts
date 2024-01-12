import {
  RollingTimeOptions,
  RollingSizeOptions,
} from "../utils/rolling-options";

export interface IRollingConfig {
  time_threshold?: RollingTimeOptions;
  size_threshold?: RollingSizeOptions;
}

export class RollingConfig implements IRollingConfig {
  #time_threshold = RollingTimeOptions.Hourly;
  #size_threshold = RollingSizeOptions.FiveMB;

  static with_defaults() {
    return new RollingConfig();
  }

  with_size_threshold(size_threshold: RollingSizeOptions) {
    if (!Object.values(RollingSizeOptions).includes(size_threshold)) {
      throw new Error(
        `size_threshold must be an instance of RollingSizeOptions. Unsupported param ${JSON.stringify(
          size_threshold,
        )}`,
      );
    }
    this.#size_threshold = size_threshold;
    return this;
  }

  with_time_threshold(time_threshold: RollingTimeOptions) {
    if (!Object.values(RollingTimeOptions).includes(time_threshold)) {
      throw new Error(
        `time_threshold must be an instance of RollingTimeOptions. Unsupported param ${JSON.stringify(
          time_threshold,
        )}`,
      );
    }
    this.#time_threshold = time_threshold;
    return this;
  }

  static from_json(json: IRollingConfig) {
    let rolling_config = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case "size_threshold":
          rolling_config = rolling_config.with_size_threshold(
            json[key] ?? RollingSizeOptions.FiveMB,
          );
          break;
        case "time_threshold":
          rolling_config = rolling_config.with_time_threshold(
            json[key] ?? RollingTimeOptions.Hourly,
          );
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
