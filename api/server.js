const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

const PORT = 5000;

app.get('/api/results',(req,res)=>{
    const dtapath = path.join(__dirname,'..','data','results.json');

    fs.readFile('dtapath','utf-8',(err,data)=>{
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Could not read results.json" });
        }
        res.json(JSON.parse(data));
    })
});
app.listen(PORT,()=>{
    console.log("Server is running");
});