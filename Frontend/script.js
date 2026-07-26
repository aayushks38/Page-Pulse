const analyzeBtn = document.getElementById("analyze-btn");
const urlInput = document.getElementById("url-input");
const resultsContainer = document.getElementById("results-container");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const statsPreview = document.getElementById("stats-preview");
const websiteInfo = document.getElementById("website-info");
const resultsGrid = document.getElementById("results-grid");
const exportBtn = document.getElementById("export-btn");
const shareBtn = document.getElementById("share-btn");
const copyBtn = document.getElementById("copy-btn");
const statusBadge = document.getElementById("status-badge");
const analyzedUrl = document.getElementById("analyzed-url");
const timestamp = document.getElementById("timestamp");
const resultsSection = document.getElementById("results-section");

const API_URL = window.BACKEND_URL || (
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000/analyze"
        : "https://page-pulse-api-ticj.onrender.com/" 
);

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

function initializeEventListeners() {
    analyzeBtn.addEventListener("click", analyzeWebsite);
    
    urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            analyzeWebsite();
        }
    });
    
    urlInput.addEventListener("input", validateInput);
    retryBtn.addEventListener("click", () => {
        errorState.classList.remove('visible');
        analyzeWebsite();
    });
    
    exportBtn.addEventListener("click", exportReport);
    shareBtn.addEventListener("click", shareResults);
    copyBtn.addEventListener("click", copyReport);
}

function validateInput() {
    let url = urlInput.value.trim();
    if (url === "") {
        urlInput.style.borderColor = "";
        return;
    }
    
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    if (isValidHttpUrl(url)) {
        urlInput.style.borderColor = "#4caf50";
    } else {
        urlInput.style.borderColor = "#d32f2f";
    }
}

function isValidHttpUrl(stringUrl) {
    try {
        const parsed = new URL(stringUrl);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

async function analyzeWebsite() {
    let rawUrl = urlInput.value.trim();

    if (!rawUrl) {
        showToast("Please enter a website URL", "error");
        urlInput.focus();
        return;
    }

    if (!/^https?:\/\//i.test(rawUrl)) {
        rawUrl = "https://" + rawUrl;
        urlInput.value = rawUrl;
    }

    if (!isValidHttpUrl(rawUrl)) {
        showToast("Please enter a valid HTTP or HTTPS URL", "error");
        return;
    }

    showLoading();
    analyzedUrl.textContent = rawUrl;
    statusBadge.textContent = "Analyzing";
    statusBadge.style.background = "#ff9800";

    scrollToResults();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: rawUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Server error (${response.status})`);
        }

        statusBadge.textContent = data.status >= 200 && data.status < 300 ? "Completed" : `Status ${data.status}`;
        statusBadge.style.background = data.status >= 200 && data.status < 300 ? "#4caf50" : "#d32f2f";

        displayResults(data, rawUrl);

    } catch (err) {
        console.error("Audit Request Error:", err);
        statusBadge.textContent = "Failed";
        statusBadge.style.background = "#d32f2f";
        
        showError(err.message || "Unable to connect to PagePulse backend. Make sure the server is running on http://localhost:5000.");
    }
}

function scrollToResults() {
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function showLoading() {
    resultsContainer.classList.remove('visible');
    errorState.classList.remove('visible');
    loadingState.classList.add('visible');
}

function showError(message) {
    errorMessage.textContent = message;
    loadingState.classList.remove('visible');
    resultsContainer.classList.remove('visible');
    errorState.classList.add('visible');
    scrollToResults();
}

function displayResults(data, url) {
    loadingState.classList.remove('visible');
    
    statsPreview.classList.add('visible');
    
    resultsGrid.innerHTML = "";

    const titleDisplay = data.title || "No title found";

    const metrics = [
        {
            title: "HTTP Status",
            value: data.status,
            description: data.status >= 200 && data.status < 300 ? "Website is accessible" : "Target returned error status",
            icon: "fas fa-server",
            type: data.status >= 200 && data.status < 300 ? "good" : "error",
            isText: false
        },
        {
            title: "Response Time",
            value: `${data.responseTime}ms`,
            description: data.responseTime < 300 ? "Excellent speed" : 
                       data.responseTime < 800 ? "Average speed" : "Slow response time",
            icon: "fas fa-tachometer-alt",
            type: data.responseTime < 300 ? "good" : data.responseTime < 800 ? "warning" : "error",
            isText: false
        },
        {
            title: "Page Title",
            value: titleDisplay,
            description: titleDisplay !== "No title found" ? `${titleDisplay.length} characters` : "Add page title",
            icon: "fas fa-heading",
            type: titleDisplay !== "No title found" && titleDisplay.length >= 10 && titleDisplay.length <= 70 ? "good" : "warning",
            isText: true
        },
        {
            title: "Meta Description",
            value: data.metaDescription ? "Found" : "Missing",
            description: data.metaDescription ? `${data.metaDescription.length} characters` : "Add meta description tag",
            icon: "fas fa-file-alt",
            type: data.metaDescription ? (data.metaDescription.length >= 50 && data.metaDescription.length <= 160 ? "good" : "warning") : "error",
            isText: false
        },
        {
            title: "H1 Tags",
            value: data.h1Count,
            description: data.h1Count === 1 ? "Optimal - single H1 tag" : 
                       data.h1Count > 1 ? "Multiple H1 tags found" : "No H1 tags found",
            icon: "fas fa-h-square",
            type: data.h1Count === 1 ? "good" : "warning",
            isText: false
        },
        {
            title: "Missing Alt Text",
            value: data.imagesMissingAlt,
            description: data.imagesMissingAlt === 0 ? "All images have alt attributes" : 
                       `${data.imagesMissingAlt} images missing alt text`,
            icon: "fas fa-image",
            type: data.imagesMissingAlt === 0 ? "good" : "warning",
            isText: false
        },
        {
            title: "Word Count",
            value: (data.wordCount || 0).toLocaleString(),
            description: data.wordCount >= 300 ? "Good content length" : "Consider expanding content",
            icon: "fas fa-font",
            type: data.wordCount >= 300 ? "good" : "warning",
            isText: false
        },
        {
            title: "SEO Score",
            value: `${data.seoScore || 0}/100`,
            description: "Overall SEO health calculation",
            icon: "fas fa-chart-line",
            type: data.seoScore >= 75 ? "good" : data.seoScore >= 50 ? "warning" : "error",
            isText: false
        }
    ];
    
    metrics.forEach((metric, index) => {
        const card = document.createElement("div");
        card.className = `metric-card ${metric.type}`;
        
        const valueClass = metric.isText ? "metric-value text-value" : "metric-value";
        
        card.innerHTML = `
            <div class="metric-header">
                <div class="metric-icon">
                    <i class="${metric.icon}"></i>
                </div>
                <h3 class="metric-title">${metric.title}</h3>
            </div>
            <div class="${valueClass}" title="${metric.isText ? metric.value : ''}">${metric.value}</div>
            <p class="metric-description">${metric.description}</p>
            <div class="metric-trend">
                <i class="fas fa-chart-line"></i>
                <span>${metric.type === 'good' ? '✓ Good' : metric.type === 'warning' ? '⚠ Check' : '✗ Issue'}</span>
            </div>
        `;
        
        setTimeout(() => {
            resultsGrid.appendChild(card);
        }, index * 40);
    });
    
    updateTimestamp();
    
    setTimeout(() => {
        resultsContainer.classList.add('visible');
    }, metrics.length * 40 + 50);
}

function updateTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    timestamp.textContent = now.toLocaleDateString('en-US', options);
}

function exportReport() {
    const reportData = {
        url: analyzedUrl.textContent,
        timestamp: timestamp.textContent,
        status: statusBadge.textContent
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pagepulse-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Report exported as JSON!", "success");
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Page Pulse Audit Report',
            text: `Audit report for ${analyzedUrl.textContent}`,
            url: window.location.href
        }).catch(() => showToast("Copied to clipboard!", "success"));
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("Copied report link!", "success");
    }
}

function copyReport() {
    const text = `Page Pulse Audit Report\nURL: ${analyzedUrl.textContent}\nDate: ${timestamp.textContent}`;
    navigator.clipboard.writeText(text);
    showToast("Summary copied to clipboard!", "success");
}

function showToast(message, type = "info") {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#d32f2f' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 2000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}
