const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  console.log(outPath);
  console.log(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`)
  return new Promise((resolve, reject) => {
    //C:\Users\ASUS\Desktop\MBM\backend\codes\7cefac1b-b4aa-4a3c-8b1f-28757232b491.cpp
    exec(
      // `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`,
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.out`, //double back slash to prevent escaping of backticks or dollar sign
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
