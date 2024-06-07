
(async () => {
    const AWS = require("aws-sdk")
    const fs = require("fs");
    const { queryList, region, tableName, totalSegments } = require('./deleted');
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
          if (data.Item !== undefined) {
            fs.appendFile("engagement-deleted.json", JSON.stringify(data.Item) + ",", (error) => {
                if (error) {
                  console.error(error);
                  throw error;
                }
              });
          }       
          else {
              console.log(`${a.id} undefined` );
              fs.appendFile("engagement-deleted-undefined.json", JSON.stringify(a.id) + ",", (error) => {
                if (error) {
                  console.error(error);
                  throw error;
                }
              });
          }
        })
        .catch(console.error)
    });
}
)();