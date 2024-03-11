import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1'});

const docClient = new AWS.DynamoDB.DocumentClient();
const timestamp = Date.now();

docClient.put({
    TableName: 'global_td_notes',
    Item: {
        user_id: 'user-api-001',
        timestamp,
        title: 'Note from application',
        content: 'The body of the note from application'
    }
}, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        console.log(`Put operation succesful in: ${AWS.config.region}`);

        setTimeout(() => {
            AWS.config.update({ region: 'eu-central-1'});
            const docClient2 = new AWS.DynamoDB.DocumentClient();
            docClient2.get({
                TableName: 'global_td_notes',
                Key: {
                    user_id: 'user-api-001',
                    timestamp,
                }
            }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Getting item from ${AWS.config.region}`);
                    console.log(data);
                }
            })
        }, 1000);
    }
})