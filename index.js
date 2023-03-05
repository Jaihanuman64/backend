const express = require('express');
const {generateFile} = require('./generateFile');
const {executeCpp} = require("./executeCpp");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/",(req,res)=>{
    return res.json({hello: "world"});
})

app.post("/run",async(req,res)=>{
    // console.log(req.body);
    

    const {language = "cpp",code} = req.body; //sending cpp as default language //equivalent to const language = req.body.language; // const code = req.body.code;

    if(code===undefined){
        return res.status(400).json({success:false, error: "Empty code body"})
    }
    try{
    //need to generate a c++ file with content from the request
    const filepath = await generateFile(language,code)
    //we need to run the file and send the response
    const output = await executeCpp(filepath);
    console.log(filepath);
    return res.json({filepath, output});
    } catch (err){
        res.status(500).json({err});
    }
})


app.listen(5000, ()=>{
    console.log('listening on port 5000')
})