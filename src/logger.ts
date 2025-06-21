import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';  

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(__dirname, '../logs/app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    }),
    new winston.transports.Console()
  ]
});

export default logger;
