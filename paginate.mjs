import AWS from 'aws-sdk';
import * as async from 'async';
import _ from 'underscore';
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

let startKey = [];
let results = [];
let pages = 0;

async.doWhilst(
    (callback) => {
        console.log('query');
        let params = {
            TableName: 'td_notes',
            Limit: 10
        };

        if (!_.isEmpty(startKey)) {
            params.ExclusiveStartKey = startKey;
        }

        docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
                callback(err, {});
            } else {
                console.log('returned data', JSON.stringify(data, null, 2));
                if (typeof data.LastEvaluatedKey !== 'undefined') {
                    startKey = data.LastEvaluatedKey;
                } else {
                    startKey = [];
                }

                if (!_.isEmpty(data.Items)) {
                    results = _.union(results, data.Items);
                    console.log('results', JSON.stringify(results, null, 2));
                }

                pages++;

                callback(null, results);
            }
        })
    },
    () => {
        console.log('conditional', startKey);
        if (_.isEmpty(startKey)) {
            console.log('is empty');
            return false;
        } else {
            console.log('is not empty');
            return true;
        }
    },
    (err, data) => {
        console.log('results');
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            console.log("Item count", data.length);
            console.log("Pages", pages);
        }
    }
);