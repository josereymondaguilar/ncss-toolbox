
(async () => {
    const AWS = require('aws-sdk');
    const fs = require("fs");
    const { region, tableName, totalSegments } = require('./config');
    const db = new AWS.DynamoDB({ region: region });
    const result = {
        totalCount: 0,
        lastEvaluatedKey: '',
        item: []
    };

    const worker = async (totalSegments, segment) => {
        let lastEvaluatedKey;
        do {
            const { Items, LastEvaluatedKey, ScannedCount } = await db.scan({
                TotalSegments: totalSegments,
                Segment: segment,
                TableName: tableName,
                FilterExpression: '#channel = :gcm OR #channel = :apns',
                ExpressionAttributeNames: {'#channel': '_channel'},
                ExpressionAttributeValues: {":gcm": {"S": "android"}, ":apns": {"S": "ios"}},
                ExclusiveStartKey: lastEvaluatedKey,
            }).promise()

            lastEvaluatedKey = LastEvaluatedKey;
            result.totalCount += ScannedCount;
            result.lastEvaluatedKey = LastEvaluatedKey
            result.item = Items

            Items.forEach(item => {
                fs.appendFile("data.json", JSON.stringify(item) + ",", (error) => {
                    if (error) {
                        console.error(error);
                        throw error;
                    }
                    });
            });
        } while (lastEvaluatedKey)
    }
    const interval = setInterval(() => {
        console.log(`intermediate result:`);
        console.log(result);
        console.log(`cost:${((performance.now() - start) / 1000).toFixed()}s`);
    }, 10000)
    const start = performance.now();
    await Promise.all([...Array(totalSegments).keys()].map(async i => {
        await worker(totalSegments, i);
    }));
    clearInterval(interval);
    console.log(`final result:`);
    console.log(result);
    console.log(`cost:${((performance.now() - start) / 1000).toFixed()}s`);
})();