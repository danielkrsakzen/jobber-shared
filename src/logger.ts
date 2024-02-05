import winston, { Logger, transports } from 'winston';
import {
  ElasticsearchTransport,
  ElasticsearchTransformer,
  LogData,
  TransformedData,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

interface BaseLogOptions {
  level: string;
  handleExceptions: boolean;
  json: boolean;
  colorize: boolean;
}

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  esNode: string,
  name: string,
  level: string
): Logger => {
  const baseOptions: BaseLogOptions = {
    level: level,
    handleExceptions: true,
    json: false,
    colorize: true,
  };

  const elasticsearchOptions: ElasticsearchTransportOptions = {
    transformer: esTransformer,
    clientOpts: {
      node: esNode,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
  };

  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(
    elasticsearchOptions
  );

  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(baseOptions), esTransport],
  });

  return logger;
};
