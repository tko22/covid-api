const moment = require('moment-timezone')

// print date in jhu timeseries data format
const getJhuTSDateString = (date: any): string => {
    return date.format("M/D/YYYY")
}

const getToday = () => {
    return moment().tz('America/Los_Angeles')
}

export {
    getJhuTSDateString,
    getToday
}