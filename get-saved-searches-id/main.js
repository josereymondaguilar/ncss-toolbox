
(async () => {
    const AWS = require("aws-sdk")
    const fs = require("fs");
    const { queryList, region, tableName, totalSegments } = require('./config');
    AWS.config.update({ region: region })
    const dynamoDB = new AWS.DynamoDB.DocumentClient()
    
    const zoneAttrs = queryList.forEach(a => {
        dynamoDB
        .get({
            TableName: tableName,
            Key: {
              id: a.id,
            },
        })
        .promise()
        .then(data => {
            fs.appendFile("data.json", JSON.stringify(data.Item) + ",", (error) => {
                if (error) {
                  console.error(error);
                  throw error;
                }
              });
              if (data.Item === undefined) {
                console.log(`${a.id} undefined` );
              }            
        })
        .catch(console.error)
    });
}
)();