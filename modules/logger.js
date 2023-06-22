const winston = require('winston');
const startTs = Math.floor(Date.now() / 1000);
const modeDebug = require("../data/config.json").modeDebug;

const fileLogs =  {
    full: new winston.transports.File({
        filename: `./data/logs/${startTs}/full.log`,
        level: 'debug',
        format: winston.format.json()
    }),
    error: new winston.transports.File({
        filename: `./data/logs/${startTs}/error.log`,
        level: 'error'
    })
};

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        fileLogs.full,
        fileLogs.error
    ]
});

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'DD.MM HH:MM:SS'
    }),

    winston.format.printf(data => `[${data.level} ${data.timestamp}] ${data.message}`)
);

if (modeDebug) {
    logger.add( new winston.transports.Console({ level: 'debug', format: consoleFormat }) );
} else {
    logger.add( new winston.transports.Console({ level: 'info', format: consoleFormat }) );
};

/**
 * Система логирования реализована на Pino, для вывода лога нужно указать первую букву типа во втором параметре:
 * 'i' - info; 'w' - warn; 'd' - debug; 'e' - error
 * 
 * @param {*} date Данный для вывода в лог
 * @param {Char} type Тип лога 'i', 'w', 'd', 'e'
 */
module.exports = (data, type) => {
    data = {
        message: data,
        timestamp: new Date()
    };

    switch (type) {
        case 'i': logger.info(data); break;
        case 'w': logger.warn(data); break;
        case 'e': logger.error(data); break;
        case 'd': logger.debug(data); break;
        default: logger.warn('Неверное взаимодействие с логгером, тип лога не распознан: ' + type);
    };
};

module.exports.exit = async (reason) => {
    await new Promise(resolve => {
        fileLogs.full.on('finish', resolve);
        fileLogs.error.on('finish', resolve);
    });

    logger.end(reason);
};