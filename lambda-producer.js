const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const highland = require('highland')
const stream = require('./_utils/adapter')
const parseS3Event = require('./_utils/parse-s3-event')


const BUCKET_NAME = process.env.BUCKET_NAME

const createStream = (objectKey) => {

    return s3.getObject({ Bucket: BUCKET_NAME, Key: objectKey })
        .createReadStream()
}

exports.handler = (event, context, callback) => {

    const objectKey = parseS3Event(event)
    const s3Stream = objectKey.map(createStream)[0]

    highland(s3Stream)
        .split()
        .map(line => line.split(','))
        .map(parts => ({
            firstname: parts[0],
            lastname: parts[1],
            email: parts[2],
            date: parts[3],
            comment: parts[4]
        }))
        .each(line => {
            stream.sendMessage(line)
                .then(() => line)
                .catch(err => err.message)
        })

    callback(null, 'success')
}
