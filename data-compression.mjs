import AWS from 'aws-sdk';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import zlib from 'node:zlib';

AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

generateNotesItem((item) => {
    console.log(`Uncompressed item: ${item}`);
    putNotesItem(item, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(data);
            console.log(`Compressed item:`, data);
            getNotesItem({
                user_id: item.user_id,
                timestamp: item.timestamp
            }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Uncompressed Item:`, data.Item);
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

function putNotesItem(item, callback) {
    if (item.content.length > 35) {
        zlib.gzip(item.content, (e, content_b) => {
            item.content_b = content_b;
            item.content = undefined;
            docClient.put({
                TableName: 'global_td_notes',
                Item: item
            }, callback);
        })
    } else {
        docClient.put({
            TableName: 'global_td_notes',
            Item: item
        }, callback)
    }
}

function getNotesItem(key, callback) {
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
                zlib.gunzip(data.Item.content_b, (err, content) => {
                    if (err) {
                        callback(err);
                    } else {
                        data.Item.content = content.toString();
                        data.Item.content_b = undefined;
                        callback(null, data);
                    }
                })
            }
        }
    });
}