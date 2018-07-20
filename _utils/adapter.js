const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()
const uuidv4 = require('uuid/v4')
const kinesis = new AWS.Kinesis()

const TABLE_NAME = process.env.TABLE_NAME
const KINESIS_STREAM = process.env.KINESIS_STREAM

module.exports.putItem = (messageBody) => {

    const params = {
        Item: {
            userId: {
                'S': uuidv4()
            },
            firstname: {
                'S': messageBody.firstname
            },
            lastname: {
                'S': messageBody.lastname
            },
            email: {
                'S': messageBody.email
            },
            date: {
                'S': messageBody.date
            },
            comment: {
                'S': messageBody.comment
            }
        },
        TableName: TABLE_NAME
    }

    return dynamodb.putItem(params).promise()
        .then(data => data)
        .catch(err => err.message)
}

module.exports.sendMessage = (streamingData) => {

    const params = {
        Data: new Buffer(JSON.stringify(streamingData)) || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */ ,
        PartitionKey: 'PARTITION1',
        StreamName: KINESIS_STREAM,

    }


    return kinesis.putRecord(params).promise()
}
