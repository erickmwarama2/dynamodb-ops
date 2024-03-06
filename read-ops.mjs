import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

docClient.get({
    TableName: 'td_notes',
    Key: {
        user_id: 'user-sdk-001',
        timestamp: 1709712803972
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data));
        console.log('------------------------------------------');
    }
});

docClient.query({
    TableName: 'td_notes',
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
        ':uid': 'user-sdk-001'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data));
        console.log('------------------------------------------');
    }
});

docClient.scan({
    TableName: 'td_notes',
    FilterExpression: 'cat = :cat',
    ExpressionAttributeValues: {
        ':cat': 'tech2'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data, null, 2));
        console.log('------------------------------------------');
    }
});

docClient.batchGet({
    RequestItems: {
        'td_notes': {
            Keys: [
                {
                    user_id: 'user-batch-002',
                    timestamp: 1709713710963
                }
            ]
        },
        'Users': {
            Keys: [
                {
                    user_id: 'Davido'
                }
            ]
        }
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data, null, 2));
        console.log('------------------------------------------');
    }
});

docClient.scan({
    TableName: 'td_notes',
    FilterExpression: 'cat = :cat',
    ExpressionAttributeValues: {
        ':cat': 'tech2'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data, null, 2));
        console.log('------------------------------------------');
    }
});