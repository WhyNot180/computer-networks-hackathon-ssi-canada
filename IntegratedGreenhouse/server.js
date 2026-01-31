const fs = require("fs");
const express = require("express");

const paths = fs.readdirSync("data", 
    {
        withFileTypes: true,
        recursive: true,
    }
);

// Should ideally store this in a database store like MongoDB
let soilData = {};
let settings = {};

// Use this to simulate time passing
let soilCounter = 0;

// Parse json sensor data
paths.forEach(path => 
    {
        if (path.isFile() && path.name.endsWith(".json"))
        {
            if (path.parentPath.includes("soil"))
            {
                const soilFile = fs.readFileSync(`${path.parentPath}/${path.name}`, "utf8");
                try
                {
                    const newSoilData = JSON.parse(soilFile);
                    let objectData = newSoilData.object;
                    if (!(soilData.hasOwnProperty(newSoilData.deviceInfo.applicationName)))
                        soilData[newSoilData.deviceInfo.applicationName] = [];
                    soilData[newSoilData.deviceInfo.applicationName].push(objectData);
                } catch (e)
                {
                    console.log(`Failed to parse ${path.name}\nError: ${e.message}`);
                }
            } 
        }
    }
);

const app = express();

app.set('views', __dirname + '/frontend');
app.set('view engine', 'pug');

app.use(express.static("public"));

app.get("/", (req, res) => {
    if (req.accepts("text/html"))
    {
        res.sendFile(__dirname + "/public/IntegratedGreenhouse.html", (err) =>
            {
                if (err)
                {
                    console.error("Error sending file: ", err);
                    res.status(500).send("File not found");
                } 
            });
    } else
    {
        res.status(406).send("Can only provide html");
    }
});

app.get("/greenhouses/:name", (req, res) => {
    if (req.accepts("text/html"))
    {
        res.render("IntegratedGreenhouse", {name: req.params.name});
    }
});

app.get("/greenhouse/:name/update", (req, res) => {
    res.status(200).json(soilData[req.params.name][soilCounter]);
    
    // Simlulate the passing of time by switching to new data
    soilCounter++;
    if (soilCounter >= soilData[req.params.name].length) soilCounter = soilData[req.params.name].length;
});

app.post("/greenhouses/:name/settings", express.json());
app.post("/greenhouses/:name/settings", (req, res) => {
    settings[req.params.name] = req.body;
    res.sendStatus(201);
});

app.listen(2000);
