module.exports = (event) => {
    if (!event || !event.Records || !Array.isArray(event.Records)) {
        return []
    }
    const extractMessage = record => JSON.parse(Buffer.from(record.kinesis.data, 'base64').toString('ascii'))

    return event.Records.map(extractMessage)
}
