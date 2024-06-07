const AWS = require("aws-sdk");
const fs = require("fs");
const cron = require("node-cron");

// AWS S3 configuration
const s3 = new AWS.S3({
  region: "ap-southeast-1", // Replace with your AWS region
  accessKeyId: "ASIAXQ45VGRRTAHFWQHI", // Replace with your AWS Access Key ID
  secretAccessKey: "TEST", // Replace with your AWS Secret Access Key
});

let counter = 0
// File to upload
const filePath = "files/"; // Replace with the path to the file you want to upload
const bucketName = "hyperwave-batch-prod-au/noti-x/tcpd/JobRecs/2024-03-08/recovery-20240308"; // Replace with your S3 bucket name

// Function to upload the file to S3
function uploadFileToS3() {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: `${filePath}${counter++}`, // Change the key as needed
    Body: fileContent,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
    } else {
      console.log("File uploaded successfully:", data.Location);
    }
  });
}

// Schedule the upload to run every 5 minutes
cron.schedule("*/1 * * * *", () => {
  console.log("Uploading file to S3...");
  uploadFileToS3();
});

console.log("Scheduled S3 file upload every 1 minutes.");
