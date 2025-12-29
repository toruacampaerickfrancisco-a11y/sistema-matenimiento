import winston from 'winston';

const level = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: level === 'silent' ? 'error' : level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({ stderrLevels: ['error'] })
  ]
});

export default logger;
