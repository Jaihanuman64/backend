const express = require('express');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/",(req,res)=>{
    return res.json({hello: "world"});
})

app.post("/run",(req,res)=>{
    // console.log(req.body);
    

    const {language = "cpp",code} = req.body; //sending cpp as default language //equivalent to const language = req.body.language; // const code = req.body.code;

    if(code===undefined){
        return res.status(400).json({success:false, error: "Empty code body"})
    }

    //need to generate a c++ file with content from the request
    //we need to run the file and send the response

    return res.json({language,code});
})


app.listen(5000, ()=>{
    console.log('listening on port 5000')
})