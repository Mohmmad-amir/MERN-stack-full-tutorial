const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path');


const logEvent = async (message, logsFileName) => {
    const dateTime = format(new Date(), 'yyyy:MM:dd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logsFileName), logItem)
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvent(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`);
    next()
}

module.exports = { logEvent, logger }