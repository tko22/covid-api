import { NowRequest, NowResponse } from '@now/node'
const cors = require('micro-cors')()


export default cors(async (req: NowRequest, res: NowResponse) => {
    return res.json({message: "Hello!"})
}