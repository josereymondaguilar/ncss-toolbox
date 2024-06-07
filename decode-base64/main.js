
(async () => {
  const buffer = require('buffer');
  const fs = require('fs');

  const b64 = "SGVsbG8sIFdvcmxkIQ==";
  const str = "Hello, World!";

  const { queryList, region, tableName, totalSegments } = require('./config');
  
  const savedSearchId = queryList.forEach(str => {
    const decode = (str) =>
      buffer.Buffer.from(str, "base64").toString("binary");
    //const encode = (str) =>
    //  buffer.Buffer.from(str, "binary").toString("base64");

    var  decoded = {};
    
    try{
      decoded = JSON.parse(decode(str.id));
      const NEW_LINE = "\n";
      const OUTPUT_FILENAME = 'results.csv';
      //fs.appendFileSync(OUTPUT_FILENAME, [str.id, decoded].join(',') + NEW_LINE);
      fs.appendFileSync(OUTPUT_FILENAME, `{ id: "${decoded.id}"},` + NEW_LINE);
    }
    catch(e){
      console.log(`Can't decode ${str.id}`);
    }
    


});

})();