import { NowRequest, NowResponse } from '@now/node'
const cors = require('micro-cors')()
const moment = require('moment-timezone')
const fetch = require('isomorphic-unfetch')
const neatCsv = require('neat-csv');
const { getJHUDailyCSV } = require('../../utils/jhuWrapper')
const { areasLookup } = require('../../utils/areaLookups')



export default cors(async (req: NowRequest, res: NowResponse) => {
    const { county = "", area = "" } = req.query
    try {
        const currDate = moment().tz('America/Los_Angeles').format("MM-DD-YYYY")
        const csvText = await getJHUDailyCSV(currDate)
        const output = await neatCsv(csvText)
        if (county === "" && area === "") {
            return res.json({error: true, message: "No Data available."})
        }
        
        // filter by area
        if (area !== "") {
            const countyList = areasLookup[(area as string)]
            const filtered = output.filter(place => countyList.includes(place.Admin2))
            return res.json(filtered)
        }

        // filter by county
        // convert 'santa-clara' to 'Santa Clara'
        const countyTransform = (county as string).split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")
        const filtered = output.filter(place => place.Admin2 == countyTransform)
        if (filtered.length > 0){
            return res.json(filtered[0])
        }
        
        res.json({error: true, message: "No Data available."})
        return
    }
    catch (e) {
        console.error(e)
        res.json({error: true, message: "No Data available."})
    }
})