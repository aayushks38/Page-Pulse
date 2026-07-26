const test = require("node:test");
const assert = require("node:assert/strict");
const { parseHtml, normalizeUrl } = require("../parser");

test("PagePulse Parser - Happy Path", () => {
    const sampleHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Digital Heroes | Test Page</title>
            <meta name="description" content="This is a valid test description for SEO audit testing purposes.">
        </head>
        <body>
            <h1>Main Page Title</h1>
            <p>Welcome to our site. Here is some sample text to test word counting capability.</p>
            <img src="logo.png" alt="Company Logo" />
            <img src="banner.jpg" />
        </body>
        </html>
    `;

    const report = parseHtml(sampleHtml, 150, 200);

    assert.equal(report.status, 200);
    assert.equal(report.responseTime, 150);
    assert.equal(report.title, "Digital Heroes | Test Page");
    assert.equal(report.metaDescription, "This is a valid test description for SEO audit testing purposes.");
    assert.equal(report.h1Count, 1);
    assert.equal(report.imagesMissingAlt, 1);
    assert.ok(report.wordCount > 10, "Word count should count text in body");
    assert.ok(report.seoScore > 50, "SEO score should be high for valid HTML");
});

test("PagePulse Parser - Failure Case 1: Missing HTML Meta Elements", () => {
    const incompleteHtml = `
        <html>
        <body>
            <p>Bare minimum page with no title, meta tags, or H1 header.</p>
            <img src="test1.png" />
            <img src="test2.png" />
        </body>
        </html>
    `;

    const report = parseHtml(incompleteHtml, 300, 200);

    assert.equal(report.title, "No title found");
    assert.equal(report.metaDescription, null);
    assert.equal(report.h1Count, 0);
    assert.equal(report.imagesMissingAlt, 2);
    assert.ok(report.seoScore < 50, "SEO score should be penalized for missing meta elements");
});

test("PagePulse Parser - Failure Case 2: Empty or Malformed Input", () => {
    const emptyReport = parseHtml("", 0, 400);

    assert.equal(emptyReport.title, "No title found");
    assert.equal(emptyReport.metaDescription, null);
    assert.equal(emptyReport.h1Count, 0);
    assert.equal(emptyReport.imagesMissingAlt, 0);
    assert.equal(emptyReport.wordCount, 0);
    assert.equal(emptyReport.seoScore, 0);
});

test("URL Normalizer - Happy Path & Protocol Addition", () => {
    assert.equal(normalizeUrl("example.com"), "https://example.com/");
    assert.equal(normalizeUrl("http://test.org/page"), "http://test.org/page");
    assert.equal(normalizeUrl(" https://google.com "), "https://google.com/");
});

test("URL Normalizer - Failure Case: Invalid URLs", () => {
    assert.throws(() => normalizeUrl("ftp://invalid-protocol.com"), /Only HTTP and HTTPS protocols are supported/);
    assert.throws(() => normalizeUrl(""), /URL must be a non-empty string/);
});
