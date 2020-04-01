const moment = require('moment-timezone')
const unfetch = require('isomorphic-unfetch')
import withRetry from "@zeit/fetch-retry";

const fetch = withRetry(unfetch)

const JHU_DAILY_API = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports`
const JHU_TIME_SERIES_API = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series`
const NOT_FOUND_404 = "404: Not Found"

// get daily csv from jhu api (date format must be MM-DD-YYYY)
const getJHUDailyCSV = async (date: string = moment().tz('America/Los_Angeles').format("MM-DD-YYYY")) : Promise<any> => {
    const ret = await fetch(`${JHU_DAILY_API}/${date}.csv`)
    const text = await ret.text()
    
    // retry once with previous day
    // jhu may be late to updating current day
    if (text === NOT_FOUND_404) {
        const newDate = moment(date, 'MM-DD-YYYY').subtract(1, 'days').format("MM-DD-YYYY")
        const newRet = await fetch(`${JHU_DAILY_API}/${newDate}.csv`)
        const newText = await newRet.text()

        // if it doesn't work, then return Error
        if (newText == NOT_FOUND_404){
            return new Error("404 Not Found")
        }
        return await newText
    }
    return await text
}

// types: confirmed_US, confirmed_global, deaths_US, deaths_global, recovered_global
const getJHUTimeSeriesCSV = async (type: string = "confirmed_US") : Promise<string> => {
    const ret = await fetch(`${JHU_TIME_SERIES_API}/time_series_covid19_${type}.csv`)
    return ret.text() 
}

export {getJHUDailyCSV, getJHUTimeSeriesCSV}