const neatCsv = require('neat-csv');
const { getJHUDailyCSV, getJHUTimeSeriesCSV } = require('./jhuWrapper')

const getCountyTimeSeries = async(county: string) : Promise<any> => {
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

export {
    getCountyTimeSeries
}
