import * as AWS from "aws-sdk";
import * as fs from "fs";

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  //accessKeyId: 'YOUR_ACCESS_KEY_ID',
  //secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: "ap-southeast-2",
});

const QUEUE_URL =
  "https://sqs.ap-southeast-2.amazonaws.com/752071735741/mobile-device-registrar-service-events-dlq";

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

// Parameters for receiving messages from the queue
const params: AWS.SQS.ReceiveMessageRequest = {
  QueueUrl: QUEUE_URL,
  MaxNumberOfMessages: 10, // Adjust this number as needed
};

async function downloadMessages() {
  try {
    let messageCount = 0;
    let done = false;

    while (!done) {
      const data = await sqs.receiveMessage(params).promise();

      if (data.Messages && data.Messages.length > 0) {
        console.log(`Received ${data.Messages.length} messages`);

        data.Messages.forEach((message, index) => {
          const parsedBody = JSON.parse(message.Body!);
          //const eventTime = new Date(parsedBody.Records[0].eventTime);
          const eventTime = new Date();
          const formattedTimestamp = eventTime
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");

          fs.writeFileSync(
            `./files/${formattedTimestamp}-${message.MessageId}`,
            message.Body as string
          );

          console.log(
            `Message ${index + 1}:${message.MessageId} ${
              message.Attributes?.SentTimestamp ?? ""
            } written to file`
          );
          messageCount++;
        });
      } else {
        console.log("No more messages available");
        done = true;
      }
    }
    console.log("Total messages received:", messageCount);
  } catch (error) {
    console.error("Error receiving messages:", error);
  }
}

downloadMessages()
  .then(() => console.log("All files downloaded successfully"))
  .catch((err) => console.error("Error downloading files:", err));
