import { json } from 'stream/consumers';
import winston, { Logger, loggers } from 'winston';
import {
  TransformedData,
  LogData,
  ElasticsearchTransformer,
  ElasticsearchTransport,
} from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elasticsearchNode: string,
  name: string,
  level: string
): Logger => {
  const Opts = {
    console: {
      level,
      handlerExceptions: true,
      json: false,
      colorize: true,
    },
    elasticsearch: {
      level,
      Transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout:10000,
        sniffOnStart: false
      },
    },
  };
  const esTransport:  ElasticsearchTransport = new ElasticsearchTransport(Opts.elasticsearch)
  const logger : Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta:{
        service: name,
    },
    transports: [new winston.transports.Console(Opts.console), esTransport]
  })
  return logger
};
