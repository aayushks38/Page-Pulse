const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Page Pulse API Running");
});

app.post("/analyze", async (req, res) => {

    try {
        const url = req.body.url;
        const startTime = Date.now();
        const response = await axios.get(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $("title").text();
        const metaDescription = $('meta[name="description"]').attr("content");
        const h1Count = $("h1").length;
        const imagesMissingAlt = $('img:not([alt])').length;
        const wordCount = $("body").text().trim().split(/\s+/).length;

        res.json({

            status: response.status,

            responseTime,

            title,

            metaDescription,

            h1Count,

            imagesMissingAlt,

            wordCount

        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});