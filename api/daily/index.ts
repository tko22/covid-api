import { NowRequest, NowResponse } from '@now/node'
const cors = require('micro-cors')()
const moment = require('moment')
const fetch = require('isomorphic-unfetch')
const neatCsv = require('neat-csv');
const { getRawCountyTimeSeries, getCountyTimeSeries, JHU_START_DATE, JHU_DATE_FORMAT } = require('../../utils/api')
const { getJhuTSDateString, getToday } = require('../../utils/dates')

export default cors(async (req: NowRequest, res: NowResponse) => {
    const { county= "" } = req.query

    if (county === "") {
        return res.json({error: true, message: "No Data available."})
    }

    // convert 'santa-clara' to 'Santa Clara'
    const countyTransform = (county as string).split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    const timeSeries = await getRawCountyTimeSeries(countyTransform)
    if (!timeSeries) {
        return (await null)
    }
    const today = getToday()
    let startDate = moment("1/22/20", JHU_DATE_FORMAT) // don't import moment objects
    let dateStr: string = getJhuTSDateString(startDate)
    let prev = parseInt(timeSeries[dateStr])
    // initial start date
    let ret = [
        {
            date: dateStr, 
            positive: parseInt(timeSeries[dateStr]), 
            positiveIncrease: 0
        }
    ]
    startDate = startDate.add(1, 'days')
    let currPositive
    
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
    
    if (filtered) {
        return res.json(filtered)
    }
    return res.json({error: true, message: "No Data available."})
})