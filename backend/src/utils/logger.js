const winston = require('winston');
const path = require('path');

function createLogger(service) {
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({
        filename: path.join(__dirname, '../../error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '../../combined.log')
      })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
}

module.exports = { createLogger }; 