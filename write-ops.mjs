import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();

docClient.put({
    TableName: 'td_notes',
    Item: {
        user_id: 'user-sdk-001',
        timestamp: 1709712803972,
        title: 'Updated sdk note title',
        content: 'first note written and then updated through the sdk',
        username: 'Erick Mutwiri'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data));
    }
})

docClient.update({
    TableName: 'td_notes',
    Key: {
        user_id: 'user-sdk-001',
        timestamp: 1709712803972
    },
    UpdateExpression: 'set #t = :t',
    ExpressionAttributeNames: {
        '#t': 'title'
    },
    ExpressionAttributeValues: {
        ':t': 'This is the new title set through :t'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(data));
    }
});

docClient.delete({
    TableName: 'td_notes',
    Key: {
        user_id: 'user-001',
        timestamp: 1709707109
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Success');
        console.log(JSON.stringify(data));
    }
})

docClient.batchWrite({
    RequestItems: {
        'td_notes': [
            {
                DeleteRequest: {
                    Key: {
                        user_id: 'user-001',
                        timestamp: 1709707167
                    },
                }
            },
            {
                DeleteRequest: {
                    Key: {
                        user_id: 'user-001',
                        timestamp: 1709706939
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        user_id: 'user-batch-001',
                        timestamp: Date.now(),
                        title: 'A note from batch put request',
                        content: 'A new note written in a batch put request',
                        cat: 'tech',
                        user_name: 'Mr. Mutwiri'
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        user_id: 'user-batch-002',
                        timestamp: Date.now(),
                        title: 'A note from batch put request',
                        content: 'A new note written in a batch put request',
                        cat: 'tech',
                        user_name: 'Mwarama Erick'
                    }
                }
            }
        ]
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Success');
        console.log(JSON.stringify(data));
    }
})