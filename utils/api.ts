const moment = require('moment-timezone')
const neatCsv = require('neat-csv');
const { getJHUDailyCSV, getJHUTimeSeriesCSV } = require('./jhuWrapper')
const { getJhuTSDateString, getToday } = require('./dates')

const JHU_DATE_FORMAT = "M/D/YYYY"
const JHU_START_DATE = moment("1/22/2020", JHU_DATE_FORMAT)


const getRawCountyTimeSeries = async(county: string) : Promise<any> => {
    const csvText = await getJHUTimeSeriesCSV("confirmed_US")
    const output = await neatCsv(csvText)
    const filtered = output.filter(place => place.Admin2 == county)

    if (filtered.length > 0){
        return (await filtered[0])
    }
    else {
        return (await null)
    }
}

const getCountyTimeSeries = async(county: string) : Promise<any> => {
    const timeSeries = await getRawCountyTimeSeries(county)
    if (!timeSeries) {
        return (await null)
    }

    const today = getToday()
    let startDate = JHU_START_DATE
    let prev = timeSeries[getJhuTSDateString(startDate)]
    // initial start date
    let ret = [
        {
            date: getJhuTSDateString(startDate), 
            positive: timeSeries[getJhuTSDateString(startDate)], 
            positiveIncrease: 0
        }
    ]
    startDate = startDate.add(1, 'days')

    // get rest of dates
    while (getJhuTSDateString(startDate) !== getJhuTSDateString(today)) {
        let dateStr = getJhuTSDateString(startDate)
        let currPositive = timeSeries[dateStr]
        if (currPositive == undefined) {
            break
        }
        ret.push(
            {
                date: dateStr, 
                positive: currPositive, 
                positiveIncrease: currPositive - prev,
            }
        )
        prev = currPositive
        startDate = startDate.add(1, 'days')
    }
    return await ret
}


export {
    getCountyTimeSeries,
    getRawCountyTimeSeries
}