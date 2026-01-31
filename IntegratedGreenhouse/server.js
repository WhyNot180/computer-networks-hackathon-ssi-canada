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
                    objectData.timestamp = newSoilData.time;
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

app.use(express.static("public"));

app.get("/", (req, res) => {
    if (req.accepts("text/html"))
    {
        res.render(__dirname + "/public/IntegratedGreenhouse.html", (err) =>
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
        res.render("greenhouse", soilData[req.params.name]);
    }
});


app.post("/greenhouses/:name/settings", express.json());
app.post("/greenhouses/:name/", (req, res) => {
    if (req.)
});
