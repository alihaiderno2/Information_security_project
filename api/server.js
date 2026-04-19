const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get('/api/results',(req,res)=>{
    const dtapath = path.join(__dirname,'..','data','results.json');

    fs.readFile(dtapath,'utf-8',(err,data)=>{
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ error: "Could not read results.json" });
        }
        res.json(JSON.parse(data));
    })
});

app.post('/api/scan',(req,res)=>{
    let targetUrl = req.body.url.trim();
    if(!targetUrl) return res.status(400).json({ error: "URL is required" });
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'http://' + targetUrl;
    }
    console.log(`Starting scan for: ${targetUrl}`);

    const pythonScript = path.join(__dirname,'..','engine','scanner.py');
    const command = `python "${pythonScript}" "${targetUrl}"`;

    exec(command, (error, stdout, stderr) => {
        console.log("Scan output:", stdout);
        if (error) {
            console.error("Error executing scan:", error);
        }

        const dataPath = path.join(__dirname, '..', 'data', 'results.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) return res.status(500).json([]);
            res.json(JSON.parse(data));
        });
    });

});

app.listen(PORT,()=>{
    console.log("Server is running");
});