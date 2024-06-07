
(async () => {
    const AWS = require("aws-sdk")
    const fs = require("fs");
<<<<<<< HEAD
    const { queryList, region, tableName, totalSegments } = require('./config');
=======
    const { queryList, region, tableName, totalSegments } = require('./deleted');
>>>>>>> a1f9c9f (master branch updates)
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
<<<<<<< HEAD
            fs.appendFile("data.json", JSON.stringify(data.Item) + ",", (error) => {
=======
          if (data.Item !== undefined) {
            fs.appendFile("engagement-deleted.json", JSON.stringify(data.Item) + ",", (error) => {
>>>>>>> a1f9c9f (master branch updates)
                if (error) {
                  console.error(error);
                  throw error;
                }
              });
<<<<<<< HEAD
              if (data.Item === undefined) {
                console.log(`${a.id} undefined` );
              }            
=======
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
>>>>>>> a1f9c9f (master branch updates)
        })
        .catch(console.error)
    });
}
)();