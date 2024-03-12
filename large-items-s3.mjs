import AWS from 'aws-sdk';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import zlib from 'node:zlib';

AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

generateNotesItem((item) => {
    console.log(`Original item: ${item}`);
    putNotesItemS3(item, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(data);
            console.log(`Stored item:`, data);
            getNotesItemS3({
                user_id: item.user_id,
                timestamp: item.timestamp
            }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Retrieved Item:`, data.Item);
                }
            })
        }
    })
});

function generateNotesItem(callback) {
    callback({
        user_id: faker.string.uuid(),
        timestamp: moment().unix(),
        cat: faker.word.sample(),
        title: faker.company.catchPhrase(),
        content: faker.hacker.phrase(),
        note_id: faker.string.uuid(),
        user_name: faker.internet.userName(),
        expires: moment().unix() + (Math.floor(1228 * Math.random()))
    });
}

function putNotesItemS3(item, callback) {
    if (item.content.length > 35) {
        var params = {
            Bucket: 'erick-td-notes-content',
            Key: item.user_id + '|' + item.timestamp,
            Body: item.content
        };

        s3.upload(params, (err, data) => {
            if (err) {
                callback(err);
            } else {
                item.content_s3 = data.Location;
                item.content = undefined;

                docClient.put({
                    TableName: 'global_td_notes',
                    Item: item
                }, callback);
            }
        })
    } else {
        docClient.put({
            TableName: 'global_td_notes',
            Item: item
        }, callback)
    }
}

function getNotesItemS3(key, callback) {
    docClient.get({
        TableName: 'global_td_notes',
        Key: key
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data.Item.content) {
                callback(null, data);
            } else {
                // zlib.gunzip(data.Item.content_b, (err, content) => {
                //     if (err) {
                //         callback(err);
                //     } else {
                //         data.Item.content = content.toString();
                //         data.Item.content_b = undefined;
                //         callback(null, data);
                //     }
                // })

                var params = {
                    Bucket: 'erick-td-notes-content',
                    Key: key.user_id + '|' + key.timestamp
                };

                s3.getObject(params, (err, content_s3) => {
                    if (err) {
                        callback(err);
                    } else {
                        data.Item.content = content_s3.Body.toString();
                        data.Item.content_s3 = undefined;
                        callback(null, data);
                    }
                })
            }
        }
    });
}