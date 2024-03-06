import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();


docClient.update({
    TableName: 'td_notes',
    Key: {
        user_id: 'user-sdk-001',
        timestamp: 1709712803972
    },
    UpdateExpression: 'set #v = #v + :incr',
    ExpressionAttributeNames: {
        '#v': 'views',
    },
    ExpressionAttributeValues: {
        ':incr': 1
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data));
    }
})