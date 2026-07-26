# Page Pulse ⚡

> A modern, lightweight website auditing and performance analysis platform built for the **Digital Heroes Internship (Software Development / SDE Role)**.

---

## 📌 Project Overview

Page Pulse is an end-to-end web auditing tool. Users enter any website URL (e.g., `https://google.com` or `github.com`), and Page Pulse performs real-time HTTP fetches and HTML analysis to generate a clean, actionable SEO & performance report.

### Key Metrics Audited:
- **HTTP Status Code** (Accessibility verification)
- **Response Time** (Server speed in milliseconds)
- **Page Title & Character Length**
- **Meta Description & Optimization Check**
- **H1 Tag Count** (SEO hierarchy verification)
- **Missing Image Alt Text Count** (Accessibility check)
- **Approximate Word Count** (Content depth analysis)
- **Dynamic SEO Health Score** (Calculated 0-100 rating)

---

## 🚀 Getting Started & Setup Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v8.0.0 or higher)

### 1. Backend Setup & Launch
```bash
# Navigate to the Backend directory
cd Backend

# Install dependencies
npm install

# Start the development server
npm start
```
The server will run at: `http://localhost:5000`

### 2. Frontend Launch
You can serve the `Frontend/` folder using any static file server or Live Server extension in VS Code:
- Open `Frontend/index.html` directly in any web browser, or
- Serve using `npx serve Frontend` or VS Code Live Server extension.

---

## 📡 API Contract

### Endpoint: `POST /analyze`

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "url": "https://example.com"
}
```
*Note: Protocol (`https://`) is optional; the API normalizes raw domain inputs.*

#### Successful Response (`200 OK`)
```json
{
  "status": 200,
  "responseTime": 243,
  "title": "Example Domain",
  "metaDescription": "Example Domain description for documentation",
  "h1Count": 1,
  "imagesMissingAlt": 0,
  "wordCount": 350,
  "seoScore": 85
}
```

#### Error Responses

- **Invalid URL / Protocol (`400 Bad Request`)**:
```json
{
  "error": "Invalid URL: Only HTTP and HTTPS protocols are supported"
}
```

- **Non-HTML Target Document (`400 Bad Request`)**:
```json
{
  "error": "Target URL returned non-HTML content (image/jpeg). Only web pages can be audited."
}
```

- **Host Unreachable / DNS Failure (`404 Not Found`)**:
```json
{
  "error": "Could not resolve domain host name. Please check the URL and try again."
}
```

- **Target Timeout (`504 Gateway Timeout`)**:
```json
{
  "error": "Request timed out while trying to reach the target URL (10s limit)."
}
```

---

## 🛠️ 3 Core Design Decisions & Technical Rationale

### 1. Modular Parser Architecture (`parser.js`)
- **Decision:** Extracted HTML parsing logic (`cheerio` traversal, text cleaning, metric calculation, and SEO scoring) and URL normalization into an isolated `parser.js` module.
- **Reasoning:** Decoupling parsing logic from Express request routing allows full unit test coverage without needing live network calls. It enforces single-responsibility principles and makes the codebase easily extensible for additional audit metrics.

### 2. Strict Error Propagation over Silent Mock Fallbacks
- **Decision:** Eliminated silent failovers to mock sample reports on backend API errors. Express routes explicitly handle timeouts (10s limit), DNS resolution failures, and non-HTML content-types (e.g. PDFs or images).
- **Reasoning:** Software development briefs prioritize correctness and defensibility. Silently showing fake data when a user inputs a non-existent URL is misleading. Returning explicit HTTP error statuses ensures transparency and robustness.

### 3. Pure Vanilla Web Architecture & Flexbox Layout System
- **Decision:** Built the frontend using Vanilla HTML5, CSS3, and JavaScript ES6+ with a flexbox column body structure (`min-height: 100vh`) and auto-scroll behavior (`scrollIntoView`).
- **Reasoning:** Zero frontend framework dependencies ensure lightning-fast initial load times, minimal bundle size, and high Lighthouse scores. The flexbox column setup guarantees the sticky footer remains pinned cleanly at the bottom across all viewport sizes.

---

## 🧪 Automated Unit Testing (Task B Deliverable)

Unit tests are written using Node.js's native test runner (`node --test`), covering both happy path execution and multiple failure edge cases.

### Running Tests:
```bash
cd Backend
npm test
```

### Test Suite Coverage:
- `✔ PagePulse Parser - Happy Path` (Valid HTML parsing, metric extraction & SEO scoring)
- `✔ PagePulse Parser - Failure Case 1: Missing HTML Meta Elements` (Missing title, meta tags, and H1s)
- `✔ PagePulse Parser - Failure Case 2: Empty or Malformed Input` (Empty string & missing body handling)
- `✔ URL Normalizer - Happy Path & Protocol Addition` (Auto-appending `https://` to raw domain inputs)
- `✔ URL Normalizer - Failure Case: Invalid URLs` (Rejecting unsupported protocols like `ftp://`)

---

## 📹 Loom Walkthrough Checklist

When recording your 2-3 minute Loom demo for submission:
1. **Show the Tool Working:** Analyze a live website (e.g. `https://google.com` or `https://github.com`) and show the smooth auto-scroll to the metrics cards.
2. **Demonstrate Error Handling:** Enter an invalid URL or non-existent domain to show the clean error state card.
3. **Code Walkthrough:** Highlight `Backend/parser.js` and `Backend/tests/parser.test.js` to explain your design decisions.
4. **Footer Requirement:** Point out the mandatory credit line: `"Built for Digital Heroes Training Task"` linked to `digitalheroesco.com`.

---

## 📄 License & Credits

- **Author:** [Aayush Kumar Sinha](https://github.com/aayushks38)
- **GitHub Repository:** [Page-Pulse](https://github.com/aayushks38/Page-Pulse)
- **Built for:** [Digital Heroes Internship Training Task](https://digitalheroesco.com/)