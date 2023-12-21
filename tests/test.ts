import { Logger, LogConfig } from "../index";

const logger = Logger.with_config(await LogConfig.from_file(`${import.meta.dir}/config.json`)); 

console.log(logger);
console.log(logger.config);
console.log(logger.level);
console.log(logger.file_prefix);
console.log(logger.time_threshold);
console.log(logger.size_threshold);

logger.debug('Hello debug');
logger.info('Hello info');
logger.warn('Hello warning');
logger.error('Hello error');
logger.critical('Hello critical');
