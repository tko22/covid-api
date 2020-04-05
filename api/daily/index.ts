import { NowRequest, NowResponse } from '@now/node'
const cors = require('micro-cors')()
const moment = require('moment')
const fetch = require('isomorphic-unfetch')
const neatCsv = require('neat-csv');
const { getRawCountyTimeSeries, getCountyTimeSeries, getAreaTimeSeries, JHU_DATE_FORMAT } = require('../../utils/api')
const { getJhuTSDateString, getToday } = require('../../utils/dates')

export default cors(async (req: NowRequest, res: NowResponse) => {
    const { county= "", area = "" } = req.query

    if (county === "" && area === "") {
        return res.json({error: true, message: "No Data available."})
    }

    if (area !== "") {
        const sumData = await getAreaTimeSeries(area)
        return res.json(sumData)
    }

    // convert 'santa-clara' to 'Santa Clara'
    const countyTransform = (county as string).split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    const filtered = await getCountyTimeSeries(countyTransform)
    
    if (filtered) {
        return res.json(filtered)
    }
    return res.json({error: true, message: "No Data available."})
})