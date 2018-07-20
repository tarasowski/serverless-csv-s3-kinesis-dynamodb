const parse = require('./_utils/parse-kinesis-event')
const db = require('./_utils/adapter')


exports.handler = (event) => {

    const messageBody = parse(event)

    return Promise.all(messageBody.map(db.putItem))

}
