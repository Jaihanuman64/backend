const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const Job = require("./models/Job");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/compilerapp");
  console.log("successfully connected to mongodb");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", async (req, res) => {
  const jobID = req.query.id;
  console.log("status requested",jobId);
  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing if query param" });
  }
  // console.log(jobId);
  try {
    const job = await Job.findById(jobId);
    if (jobId == undefined) {
      return res.status(404).json({ success: false, error: "invalid job ID" });
    }
    return res
      .status(200)
      .json({ success: false, error: "missing if query param" });
  } catch (err) {
    return res.status(400).json(job);
  }
});

app.post("/run", async (req, res) => {
  // console.log(req.body);

  const { language = "cpp", code } = req.body; //sending cpp as default language //equivalent to const language = req.body.language; // const code = req.body.code;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }
  let job;
  try {
    //need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    //we need to run the file and send the response
    job = await new Job({ language, filepath }).save();
    const jobId = job["_id"];

    res.status(201).json({ success: true, jobId });
    console.log(job);
    let output;
    job["startedAt"] = new Date();
    if (language === "py") {
      output = await executePy(filepath);
    } else if (language === "cpp") {
      output = await executeCpp(filepath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = "output";
    await job.save();
    console.log(job);
    // return res.json({ filepath, output });
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(job);
    // res.status(500).json({ err });
  }
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
