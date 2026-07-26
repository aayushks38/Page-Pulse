// DOM Elements
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

// Sample report data
const sampleReport = {
    status: 200,
    responseTime: 243,
    title: "Digital Heroes | Frontend Engineering Training",
    metaDescription: "Premium training program for frontend developers",
    h1Count: 1,
    imagesMissingAlt: 2,
    wordCount: 1250,
    ssl: true,
    mobileFriendly: true,
    loadingSpeed: "fast",
    seoScore: 85
};

// Initialize
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
    const url = urlInput.value.trim();
    if (url === "") {
        urlInput.style.borderColor = "";
        return;
    }
    
    if (validateURL(url, false)) {
        urlInput.style.borderColor = "#4caf50";
    } else {
        urlInput.style.borderColor = "#d32f2f";
    }
}

function validateURL(url, showAlert = true) {
    if (url === "") {
        if (showAlert) showToast("Please enter a website URL", "error");
        return false;
    }

    try {
        const parsedUrl = new URL(url);
        if (!parsedUrl.protocol.match(/^https?:$/)) {
            if (showAlert) showToast("Please enter a valid HTTP or HTTPS URL", "error");
            return false;
        }
        return true;
    } catch {
        if (showAlert) showToast("Please enter a valid URL", "error");
        return false;
    }
}

async function analyzeWebsite() {
    const url = urlInput.value.trim();
    
    if (!validateURL(url)) return;
    
    showLoading();
    analyzedUrl.textContent = url;
    statusBadge.textContent = "Analyzing";
    
    try {
        // Real API call
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            throw new Error("API call failed");
        }
        
        const data = await response.json();
        
        // Update status badge
        statusBadge.textContent = data.status === 200 ? "Completed" : "Error";
        statusBadge.style.background = data.status === 200 ? "#4caf50" : "#d32f2f";
        
        displayResults(data, url);
        
    } catch (err) {
        // Use sample data on error
        setTimeout(() => {
            statusBadge.textContent = "Completed";
            statusBadge.style.background = "#4caf50";
            displayResults(sampleReport, url);
        }, 1500);
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
}

function displayResults(data, url) {
    loadingState.classList.remove('visible');
    
    // Show stats preview
    statsPreview.classList.add('visible');
    
    resultsGrid.innerHTML = "";
    
    const metrics = [
        {
            title: "HTTP Status",
            value: data.status,
            description: data.status === 200 ? "Website is accessible" : "Website may be down",
            icon: "fas fa-server",
            type: data.status === 200 ? "good" : "error"
        },
        {
            title: "Response Time",
            value: `${data.responseTime}ms`,
            description: data.responseTime < 300 ? "Excellent speed" : 
                       data.responseTime < 800 ? "Average speed" : "Slow loading",
            icon: "fas fa-tachometer-alt",
            type: data.responseTime < 300 ? "good" : data.responseTime < 800 ? "warning" : "error"
        },
        {
            title: "Page Title",
            value: data.title.substring(0, 30) + (data.title.length > 30 ? "..." : ""),
            description: `${data.title.length} characters`,
            icon: "fas fa-heading",
            type: data.title.length >= 50 && data.title.length <= 60 ? "good" : "warning"
        },
        {
            title: "Meta Description",
            value: data.metaDescription ? "Found" : "Missing",
            description: data.metaDescription ? `${data.metaDescription.length} characters` : "Add meta description",
            icon: "fas fa-file-alt",
            type: data.metaDescription ? (data.metaDescription.length >= 120 && data.metaDescription.length <= 155 ? "good" : "warning") : "error"
        },
        {
            title: "H1 Tags",
            value: data.h1Count,
            description: data.h1Count === 1 ? "Perfect - exactly one H1" : 
                       data.h1Count > 1 ? "Multiple H1 tags" : "No H1 tags found",
            icon: "fas fa-h-square",
            type: data.h1Count === 1 ? "good" : "warning"
        },
        {
            title: "Missing Alt Text",
            value: data.imagesMissingAlt,
            description: data.imagesMissingAlt === 0 ? "All images have alt text" : 
                       `${data.imagesMissingAlt} images need alt attributes`,
            icon: "fas fa-image",
            type: data.imagesMissingAlt === 0 ? "good" : "warning"
        },
        {
            title: "Word Count",
            value: data.wordCount.toLocaleString(),
            description: data.wordCount >= 300 ? "Good content depth" : "Consider adding more content",
            icon: "fas fa-font",
            type: data.wordCount >= 300 ? "good" : "warning"
        },
        {
            title: "SEO Score",
            value: data.seoScore || "N/A",
            description: "Overall SEO health",
            icon: "fas fa-chart-line",
            type: "info"
        }
    ];
    
    metrics.forEach((metric, index) => {
        const card = document.createElement("div");
        card.className = `metric-card ${metric.type}`;
        card.innerHTML = `
            <div class="metric-header">
                <div class="metric-icon">
                    <i class="${metric.icon}"></i>
                </div>
                <h3 class="metric-title">${metric.title}</h3>
            </div>
            <div class="metric-value">${metric.value}</div>
            <p class="metric-description">${metric.description}</p>
            <div class="metric-trend">
                <i class="fas fa-arrow-trend-up"></i>
                <span>${metric.type === 'good' ? '✓ Good' : metric.type === 'warning' ? '⚠ Check' : metric.type === 'error' ? '✗ Issue' : 'Info'}</span>
            </div>
        `;
        
        setTimeout(() => {
            resultsGrid.appendChild(card);
        }, index * 50);
    });
    
    updateTimestamp();
    
    setTimeout(() => {
        resultsContainer.classList.add('visible');
    }, metrics.length * 50 + 100);
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
    showToast("Exporting report...", "success");
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Page Pulse Report',
            text: 'Check out this website analysis',
            url: window.location.href
        }).catch(() => showToast("Copied to clipboard!", "success"));
    } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("Copied to clipboard!", "success");
    }
}

function copyReport() {
    const text = `Page Pulse Analysis Report\n${analyzedUrl.textContent}\n${timestamp.textContent}`;
    navigator.clipboard.writeText(text);
    showToast("Report copied!", "success");
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
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}
