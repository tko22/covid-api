const fs = require('fs')
const util = require('util');
const neatCsv = require('neat-csv');

const readStreamFile = util.promisify(fs.createReadStream);


const areasLookup = {
    "bay-area": ["Alameda", "Contra Costa", "Marin", "Napa", "San Francisco", "San Mateo", "Santa Clara", "Solano", "Sonoma"]
}

const fipsLookup = async (fips: string): Promise<any> => {
    const data = await readStreamFile('./fips-lookup.csv').pipe(neatCsv())
    return data
}

export {
    areasLookup,
    fipsLookup
}