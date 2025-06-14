import winston from 'winston'
import path from 'path'
import fs from 'fs'

// create logs directory
const logDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true})
}


// define log format
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
)

// create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'svg-icon-manager'},
     transports: [
        // all logs with 'infor' and below to combined.log
        new winston.transports.File({filename: path.join(logDir, 'combined.log')}),
        // only error logs to error.log
        new winston.transports.File({filename: path.join(logDir, 'error.log'), level: 'error'}),
     ]
})

// add console transport 
if(process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    )
}

// create stream for morgan
const stream = {
    write: (message: string) => {
        logger.info(message)
    }
}

export { logger, stream }