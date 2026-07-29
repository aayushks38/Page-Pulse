const cheerio = require("cheerio");
function parseHtml(html, responseTime = 0, status = 200) {
    if (!html || typeof html !== "string") {
        return {
            status: status || 400,
            responseTime: responseTime || 0,
            title: "No title found",
            metaDescription: null,
            h1Count: 0,
            imagesMissingAlt: 0,
            wordCount: 0,
            seoScore: 0
        };
    }

    const $ = cheerio.load(html);

    const titleText = $("title").first().text().trim();
    const title = titleText.length > 0 ? titleText : "No title found";
    const metaDescAttr = $('meta[name="description" i]').attr("content") ||
                         $('meta[property="og:description" i]').attr("content");
    const metaDescription = metaDescAttr ? metaDescAttr.trim() : null;

    const h1Count = $("h1").length;

    let imagesMissingAlt = 0;
    $("img").each((_, img) => {
        const alt = $(img).attr("alt");
        if (alt === undefined || alt === null || alt.trim() === "") {
            imagesMissingAlt++;
        }
    });


    const bodyClone = $("body").clone();
    bodyClone.find("script, style, noscript, svg, iframe").remove();
    const text = bodyClone.text().replace(/\s+/g, " ").trim();
    const wordCount = text.length > 0 ? text.split(" ").length : 0;

    let seoScore = 0;
    if (status >= 200 && status < 300) seoScore += 25;
    if (title && title !== "No title found" && title.length >= 10 && title.length <= 70) seoScore += 20;
    if (metaDescription && metaDescription.length >= 50 && metaDescription.length <= 160) seoScore += 20;
    if (h1Count === 1) seoScore += 15;
    else if (h1Count > 1) seoScore += 5;
    if (imagesMissingAlt === 0) seoScore += 10;
    if (wordCount >= 300) seoScore += 10;

    return {
        status,
        responseTime,
        title,
        metaDescription,
        h1Count,
        imagesMissingAlt,
        wordCount,
        seoScore
    };
}

function normalizeUrl(inputUrl) {
    if (!inputUrl || typeof inputUrl !== "string" || inputUrl.trim() === "") {
        throw new Error("URL must be a non-empty string");
    }

    let urlStr = inputUrl.trim();

    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(urlStr)) {
        if (!/^https?:\/\//i.test(urlStr)) {
            throw new Error("Only HTTP and HTTPS protocols are supported");
        }
    } else {
        urlStr = "https://" + urlStr;
    }

    const parsed = new URL(urlStr);
    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only HTTP and HTTPS protocols are supported");
    }

    return parsed.href;
}

module.exports = {
    parseHtml,
    normalizeUrl
};
