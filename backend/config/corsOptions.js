const allowOrigins = require('./allowOrigins')

const corsOption = {
    origin: (origin, callback) => {
        if (allowOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'))
        }
    },
    credential: true,
    optionsSuccessStatus: 200
}

module.exports = corsOption