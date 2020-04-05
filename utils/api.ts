const moment = require('moment-timezone')
const neatCsv = require('neat-csv');
const { getJHUDailyCSV, getJHUTimeSeriesCSV } = require('./jhuWrapper')
const { areasLookup } = require('./areaLookups')
const { getJhuTSDateString, getToday } = require('./dates')

const JHU_DATE_FORMAT = "M/D/YY"

const getRawCountyTimeSeries = async (county: string) : Promise<any> => {
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

// county example: Santa Clara
const getCountyTimeSeries = async (county: string) : Promise<any> => {
    const timeSeries = await getRawCountyTimeSeries(county)
    if (!timeSeries) {
        return (await null)
    }
    const today = getToday()
    let startDate = moment("1/22/2020", JHU_DATE_FORMAT)
    let prev = parseInt(timeSeries[getJhuTSDateString(startDate)])
    // initial start date
    let ret = [
        {
            date: getJhuTSDateString(startDate), 
            positive: parseInt(timeSeries[getJhuTSDateString(startDate)]), 
            positiveIncrease: 0
        }
    ]
    startDate = startDate.add(1, 'days')
    let currPositive
    let dateStr
    // get rest of dates
    while (getJhuTSDateString(startDate) !== getJhuTSDateString(today)) {
        dateStr = getJhuTSDateString(startDate)
        currPositive = timeSeries[dateStr] != undefined ? parseInt(timeSeries[dateStr]) : null
        if (currPositive === null) {
            startDate = startDate.add(1, 'days')
            continue
        }
    

        const increase = prev != undefined ? currPositive - prev : null
        ret.push(
            {
                date: dateStr, 
                positive: currPositive, 
                positiveIncrease: increase,
            }
        )
        prev = currPositive
        startDate = startDate.add(1, 'days')
    }
    const filtered = ret.filter(elm => elm.positive != undefined && elm.positiveIncrease != undefined)
    return filtered
}

const getAreaTimeSeries = async (area: string) : Promise<any> => {
    const counties = areasLookup[area]
    let countiesSeries = []
    for (let i = 0; i < counties.length; i++){
        const x = await getCountyTimeSeries(counties[i])
        countiesSeries.push(x)
    }

    let ret = countiesSeries[0]
    for (let i = 1; i < counties.length; i++){
        const countyData = countiesSeries[i]
        ret = ret.map((day, index) => ({ date: countyData[index].date, positive: day.positive + countyData[index].positive, positiveIncrease: day.positiveIncrease + countyData[index].positiveIncrease}))
    }
    return ret
}


export {
    getCountyTimeSeries,
    getRawCountyTimeSeries,
    JHU_DATE_FORMAT,
    getAreaTimeSeries
}