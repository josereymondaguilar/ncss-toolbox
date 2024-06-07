import * as AWS from "aws-sdk";
import * as fs from "fs";
import { S3DownloadConfig, config } from "./config";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";

const BUCKET_NAME = "hyperwave-batch-prod-au"; // "hyperwave-transactional-prod-au";
const KEY_PATH = "noti-x/tcpd/JobRecs/2024-03-08/";
const s3Client = new S3Client([
  {
    region: "ap-southeast-2",
    requestHandler: new NodeHttpHandler(),
  },
]);

// Function to download a file from S3
async function downloadFileFromS3(key: string): Promise<void> {
  const outputFilename = key;
  const params = {
    Bucket: BUCKET_NAME,
    Key: KEY_PATH + key,
  };
  const data = await s3Client.send(new GetObjectCommand(params));
  const writeStream = fs.createWriteStream("./files/" + outputFilename);

  if (data.Body) {
    (data.Body as NodeJS.ReadableStream).pipe(writeStream);
  }

  return new Promise((resolve, reject) => {
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
  });
}

// Function to download multiple files from S3 based on config
async function downloadFilesFromS3(
  config: S3DownloadConfig[]
): Promise<void[]> {
  const downloadPromises: Promise<void>[] = [];

  for (const { key } of config) {
    downloadPromises.push(downloadFileFromS3(key));
  }

  return Promise.all(downloadPromises);
}

downloadFilesFromS3(config)
  .then(() => console.log("All files downloaded successfully"))
  .catch((err) => console.error("Error downloading files:", err));
