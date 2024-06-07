import * as fs from "fs";
import * as path from "path";

function renameAndReplace(fileName: string, newFileName: string): void {
  try {
    // Rename the file
    fs.renameSync(
      directoryPath + "/" + fileName,
      directoryPath + "/" + newFileName
    );

    // Read the content of the new file
    const content = fs.readFileSync(directoryPath + "/" + newFileName, "utf-8");

    // Replace the content to ensure it aligns with the new file name
    const updatedContent = content.replace(fileName, newFileName);

    // Write the updated content back to the file
    fs.writeFileSync(
      directoryPath + "/" + newFileName,
      updatedContent,
      "utf-8"
    );

    console.log(
      `File "${fileName}" renamed to "${newFileName}" and content updated successfully.`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

function getAllFiles(directoryPath: string): string[] {
  try {
    // Get a list of all files and directories in the specified directory
    const filesAndDirs = fs.readdirSync(directoryPath);

    // Filter out directories and return only file paths
    return filesAndDirs.filter((item) =>
      fs.statSync(path.join(directoryPath, item)).isFile()
    );
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Example usage:
const directoryPath = "files";

const files = getAllFiles(directoryPath);
console.log("Files in directory:", files);

files.forEach((fileName) => {
  const newFileName = fileName.replace("-v2", "-v3");
  renameAndReplace(fileName, newFileName);
});
