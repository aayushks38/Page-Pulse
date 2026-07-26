# Digital Heroes Internship Qualification Task Submission
**Role:** Software Development (SDE)  
**Candidate Name:** Aayush Kumar Sinha  
**Date:** July 2026  
**Project Name:** Page Pulse ⚡  

---

## 📌 Executive Summary

Page Pulse is an end-to-end web auditing platform built to fulfill **Task A** and **Task B** of the Digital Heroes Software Development Internship Qualification Task Kit. It allows users to enter any public URL and performs real-time HTML parsing to deliver actionable SEO, accessibility, and performance insights with standard HTTP status verification.

---

## 🔗 Submission Links

| Deliverable | Link |
| :--- | :--- |
| **Live Deployed Website** | [https://page-pulse.vercel.app](https://page-pulse.vercel.app) |
| **Live Backend API (Render)** | [https://page-pulse-api-ticj.onrender.com/analyze](https://page-pulse-api-ticj.onrender.com/analyze) |
| **Public GitHub Repository** | [https://github.com/aayushks38/Page-Pulse](https://github.com/aayushks38/Page-Pulse) |
| **Loom Walkthrough Video** | *[Insert Your Loom Link Here]* |

---

## 🛠️ Task A: Core Build Highlights

1. **Backend API (`POST /analyze`):**
   - Built with Node.js, Express, and Axios.
   - Accepts any website URL (e.g. `google.com`, `https://github.com`), normalizes raw protocol inputs, fetches the target DOM, and extracts 8 key metrics:
     - HTTP Status Code & Server Response Time (ms)
     - Page Title & Title Character Length
     - Meta Description & Optimization Check
     - H1 Tag Count (SEO Hierarchy)
     - Missing Image Alt Text Count (Accessibility)
     - Approximate Word Count & Dynamic 0-100 SEO Score
   - Includes graceful error handling for invalid domain names, 404/500 HTTP statuses, and non-HTML payloads.

2. **Frontend UI:**
   - Lightweight, responsive Vanilla HTML5, CSS3, and JavaScript layout with a sticky flexbox footer.
   - Features input validation, loading spinner states, interactive toast messages, centered hero/footer sections, and an **automatic smooth scroll** to the results section upon clicking **Analyze**.

3. **Mandatory Live Build Credit Line:**
   - Verified footer credit line reading:  
     `"Built for Digital Heroes Training Task"` hyperlinked directly to [https://digitalheroesco.com/](https://digitalheroesco.com/).

---

## 🛡️ Task B: Defensible Code & Design Decisions

### 1. Modular HTML Parsing Engine (`Backend/parser.js`)
- **Design Decision:** Decoupled HTML DOM extraction logic from Express HTTP routing into a standalone `parser.js` module.
- **Reasoning:** Enables clean unit testing without booting HTTP servers, improves separation of concerns, and simplifies future metric additions.

### 2. Comprehensive Error Handling & Safe JSON Contracts
- **Design Decision:** Handled all network timeouts, invalid DNS entries, and non-HTML payloads with custom structured error JSON responses rather than raw process crashes or generic 500 pages.
- **Reasoning:** Guarantees that the frontend always receives predictable JSON structure, preventing unexpected UI crashes.

### 3. Pure Vanilla Web Stack & Sticky Flexbox Layout
- **Design Decision:** Chose pure Vanilla HTML/CSS/JS without heavy frameworks like React or Tailwind.
- **Reasoning:** Delivers sub-millisecond initial renders, zero client-side bundle overhead, maximum Lighthouse performance, and clean sticky footer placement across all viewports.

---

## 🧪 Automated Unit Test Suite

The parsing and URL normalization logic is tested using Node.js's native test runner (`node --test`), covering both happy path execution and edge-case failure scenarios.

### How to Run:
```bash
cd Backend
npm test
```

### Test Suite Results:
- `✔ PagePulse Parser - Happy Path` (Valid HTML parsing & metric calculations)
- `✔ PagePulse Parser - Failure Case 1: Missing HTML Meta Elements` (Handling missing title & H1 tags)
- `✔ PagePulse Parser - Failure Case 2: Empty or Malformed Input` (Empty body & whitespace inputs)
- `✔ URL Normalizer - Happy Path` (Auto-appending `https://` to raw domain inputs)
- `✔ URL Normalizer - Failure Case` (Rejecting invalid/unsupported protocols like `ftp://`)

---

## 🤖 AI Usage & Reflection Statement

> **AI Tool Usage:** ChatGPT, Claude, and Gemini were utilized during this task to pressure-test edge-case error scenarios, refine regex pattern matching for word counting, and generate initial unit test fixtures.  
> **Personal Engineering Contributions:** All architectural decisions—including decoupling `parser.js`, building the flexbox design system, configuring CORS & production Render/Vercel deployment pipelines, standardizing 52px input-button component heights, centering layout typography, and implementing smooth auto-scrolling—were customized and verified specifically for this project.

---

## 📹 Loom Walkthrough Agenda (2–3 Minutes)

1. **Live Web App Demo:** Enter `https://www.youtube.com/`, click **Analyze**, and show the auto-scroll to the metrics cards.
2. **Error State Handling:** Enter a broken domain to demonstrate non-crashing error state cards.
3. **Backend & Test Code Tour:** Walk through `Backend/parser.js` and run `npm test` in the terminal.
4. **Footer Verification:** Highlight the visible `"Built for Digital Heroes Training Task"` credit link to `digitalheroesco.com`.
