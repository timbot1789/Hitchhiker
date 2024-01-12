import { Logger, LogConfig } from "../index";

const logger = Logger.with_config(
  await LogConfig.from_file(`${import.meta.dir}/config.json`),
);

function main() {
  logger.debug("Hello debug");
  logger.info("Hello info");
  logger.warn("Hello warning");
  logger.error("Hello error");
  logger.critical("Hello critical");
}

main();
