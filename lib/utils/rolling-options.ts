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
