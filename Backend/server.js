const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { parseHtml, normalizeUrl } = require("./parser");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "🚀 Page Pulse API Running", version: "1.0.0" });
});

app.post("/analyze", async (req, res) => {
    try {
        const { url: rawUrl } = req.body;
        
        if (!rawUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        let targetUrl;
        try {
            targetUrl = normalizeUrl(rawUrl);
        } catch (err) {
            return res.status(400).json({ error: `Invalid URL: ${err.message}` });
        }

        const startTime = Date.now();

        const response = await axios.get(targetUrl, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PagePulse-Auditor/1.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            },
            maxRedirects: 5,
            validateStatus: status => status < 500 // Don't throw for 404, etc.
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const contentType = response.headers["content-type"] || "";
        

        if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
            return res.status(400).json({ 
                error: `Target URL returned non-HTML content (${contentType || 'unknown'}). Only web pages can be audited.` 
            });
        }

        const report = parseHtml(response.data, responseTime, response.status);
        res.json(report);

    } catch (error) {
        console.error("Analysis Error:", error.message);

        if (error.code === "ECONNABORTED") {
            return res.status(504).json({ error: "Request timed out while trying to reach the target URL (10s limit)." });
        }
        if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
            return res.status(404).json({ error: "Could not resolve domain host name. Please check the URL and try again." });
        }

        res.status(500).json({
            error: error.response?.data?.message || error.message || "Failed to analyze website"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
