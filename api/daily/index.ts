import { NowRequest, NowResponse } from '@now/node'
const cors = require('micro-cors')()
const moment = require('moment-timezone')
const fetch = require('isomorphic-unfetch')
const neatCsv = require('neat-csv');
const { getCountyTimeSeries } = require('../../utils/api')


export default cors(async (req: NowRequest, res: NowResponse) => {
    const { county= "" } = req.query

    if (county === "") {
        return res.json({error: true, message: "No Data available."})
    }

    // convert 'santa-clara' to 'Santa Clara'
    const countyTransform = (county as string).split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
    const filtered = await getCountyTimeSeries(countyTransform)
    
    if (filtered) {
        return res.json(filtered)
    }
    return res.json({error: true, message: "No Data available."})
})