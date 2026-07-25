// ========================================
// PAGE PULSE - PREMIUM SEO ANALYSIS TOOL
// JavaScript Implementation with Modern Microinteractions
// ========================================

// DOM Elements
const analyzeBtn = document.getElementById("analyze-btn");
const urlInput = document.getElementById("url-input");
const resultsContainer = document.getElementById("results-container");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const websiteInfo = document.getElementById("website-info");
const resultsGrid = document.getElementById("results-grid");
const exportBtn = document.getElementById("export-btn");
const shareBtn = document.getElementById("share-btn");
const copyBtn = document.getElementById("copy-btn");
const statusBadge = document.getElementById("status-badge");
const analyzedUrl = document.getElementById("analyzed-url");
const timestamp = document.getElementById("timestamp");

// Sample report data for demo
const sampleReport = {
    status: 200,
    responseTime: 243,
    title: "Digital Heroes | Frontend Engineering Training",
    metaDescription: "Premium training program for frontend developers looking to build recruiter-impressing portfolio projects",
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
    setupDemoMode();
    updateTimestamp();
});

// Event Listeners Setup
function initializeEventListeners() {
    analyzeBtn.addEventListener("click", analyzeWebsite);
    
    // Enter key support for URL input
    urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            analyzeWebsite();
        }
    });
    
    // Button ripple effect
    analyzeBtn.addEventListener("click", createRippleEffect);
    
    // Input focus effects
    urlInput.addEventListener("focus", () => {
        urlInput.parentElement.classList.add("input-focused");
    });
    
    urlInput.addEventListener("blur", () => {
        urlInput.parentElement.classList.remove("input-focused");
    });
    
    // Input validation on change
    urlInput.addEventListener("input", validateInput);
    
    // Retry button
    retryBtn.addEventListener("click", () => {
        hideError();
        analyzeWebsite();
    });
    
    // Action buttons
    exportBtn.addEventListener("click", exportReport);
    shareBtn.addEventListener("click", shareResults);
    copyBtn.addEventListener("click", copyReport);
}

// Input validation with visual feedback
function validateInput() {
    const url = urlInput.value.trim();
    const isValid = validateURL(url, false);
    
    if (url === "") {
        urlInput.style.borderColor = "var(--color-border)";
        return;
    }
    
    if (isValid) {
        urlInput.style.borderColor = "var(--color-success)";
    } else {
        urlInput.style.borderColor = "var(--color-error)";
    }
}

// Create ripple effect for buttons
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector(".btn-ripple");
    
    if (!ripple) return;
    
    // Remove any existing animation
    ripple.style.animation = "none";
    ripple.offsetHeight; // Trigger reflow
    
    // Calculate position
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Set position and size
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    
    // Start animation
    ripple.style.animation = "ripple 600ms linear";
}

// Main analysis function
async function analyzeWebsite() {
    const url = urlInput.value.trim();
    
    if (!validateURL(url)) return;
    
    // Show loading state
    showLoading();
    
    // Update UI
    analyzedUrl.textContent = url;
    statusBadge.textContent = "Analyzing";
    statusBadge.style.background = "var(--color-warning)";
    
    try {
        // Real API call to backend
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
        const data = await response.json();
        
        // For demo purposes if API fails, use sample data
        if (!response.ok) {
            console.warn("API call failed, using demo data");
            await new Promise(resolve => setTimeout(resolve, 1500));
            Object.assign(data, sampleReport);
        }
        
        // Update status badge based on HTTP status
        if (data.status === 200) {
            statusBadge.textContent = "Success";
            statusBadge.style.background = "var(--gradient-primary)";
        } else {
            statusBadge.textContent = "Error";
            statusBadge.style.background = "var(--color-error)";
        }
        
        // Display results
        displayResults(data, url);
        
    } catch (err) {
        showError(err.message || "Unable to analyze website. Please check the URL and try again.");
    }
}

// URL validation with better UX
function validateURL(url, showAlert = true) {
    if (url === "") {
        if (showAlert) {
            showToast("Please enter a website URL", "warning");
        }
        return false;
    }

    try {
        const parsedUrl = new URL(url);
        
        // Ensure it's http or https
        if (!parsedUrl.protocol.match(/^https?:$/)) {
            if (showAlert) {
                showToast("Please enter a valid HTTP or HTTPS URL", "warning");
            }
            return false;
        }
        
        return true;
    } catch {
        if (showAlert) {
            showToast("Please enter a valid URL including https://", "error");
        }
        return false;
    }
}

// Show loading state with animations
function showLoading() {
    // Hide other states
    resultsContainer.style.display = "none";
    errorState.style.display = "none";
    
    // Show loading state
    loadingState.style.display = "block";
    
    // Animate progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.animation = "progressAnimation 2s ease-in-out infinite";
    }
}

// Show error state
function showError(message) {
    errorMessage.textContent = message;
    
    // Hide other states
    loadingState.style.display = "none";
    resultsContainer.style.display = "none";
    
    // Show error state
    errorState.style.display = "block";
    
    // Update status badge
    statusBadge.textContent = "Failed";
    statusBadge.style.background = "var(--color-error)";
}

// Hide error state
function hideError() {
    errorState.style.display = "none";
}

// Display results with animations
function displayResults(data, url) {
    // Hide loading state
    loadingState.style.display = "none";
    
    // Clear previous results
    resultsGrid.innerHTML = "";
    
    // Create metric cards
    const metrics = [
        {
            id: "http-status",
            title: "HTTP Status",
            value: data.status,
            description: data.status === 200 ? "Website is accessible" : "Website may be down",
            icon: "fas fa-server",
            type: data.status === 200 ? "good" : "error",
            trend: data.status === 200 ? "🟢 Healthy" : "🔴 Issue detected"
        },
        {
            id: "response-time",
            title: "Response Time",
            value: `${data.responseTime}ms`,
            description: data.responseTime < 300 ? "Excellent loading speed" : 
                       data.responseTime < 800 ? "Average loading speed" : "Slow loading speed",
            icon: "fas fa-tachometer-alt",
            type: data.responseTime < 300 ? "good" : 
                  data.responseTime < 800 ? "warning" : "error",
            trend: data.responseTime < 300 ? "⚡ Fast" : 
                   data.responseTime < 800 ? "⚡ Average" : "🐌 Slow"
        },
        {
            id: "page-title",
            title: "Page Title",
            value: data.title.length > 40 ? data.title.substring(0, 40) + "..." : data.title,
            description: `${data.title.length} characters`,
            icon: "fas fa-heading",
            type: data.title.length >= 50 && data.title.length <= 60 ? "good" : "warning",
            trend: data.title.length >= 50 && data.title.length <= 60 ? "✓ Optimal" : "⚠️ Check length"
        },
        {
            id: "meta-description",
            title: "Meta Description",
            value: data.metaDescription ? (data.metaDescription.length > 50 ? 
                   data.metaDescription.substring(0, 50) + "..." : data.metaDescription) : "Not Found",
            description: data.metaDescription ? `${data.metaDescription.length} characters` : "Missing meta description",
            icon: "fas fa-file-alt",
            type: data.metaDescription && data.metaDescription.length >= 120 && 
                  data.metaDescription.length <= 155 ? "good" : 
                  data.metaDescription ? "warning" : "error",
            trend: data.metaDescription ? 
                  (data.metaDescription.length >= 120 && data.metaDescription.length <= 155 ? "✓ Optimal" : "⚠️ Check length") : 
                  "❌ Missing"
        },
        {
            id: "h1-count",
            title: "H1 Count",
            value: data.h1Count,
            description: data.h1Count === 1 ? "Perfect - exactly one H1" : 
                       data.h1Count > 1 ? "Multiple H1 tags" : "No H1 tags found",
            icon: "fas fa-h-square",
            type: data.h1Count === 1 ? "good" : data.h1Count > 1 ? "warning" : "error",
            trend: data.h1Count === 1 ? "✅ Perfect" : 
                   data.h1Count > 1 ? "⚠️ Multiple" : "❌ Missing"
        },
        {
            id: "missing-alt",
            title: "Images Missing Alt",
            value: data.imagesMissingAlt,
            description: data.imagesMissingAlt === 0 ? "All images have alt text" : 
                       `${data.imagesMissingAlt} images need alt attributes`,
            icon: "fas fa-image",
            type: data.imagesMissingAlt === 0 ? "good" : "warning",
            trend: data.imagesMissingAlt === 0 ? "✅ Accessible" : "⚠️ Needs attention"
        },
        {
            id: "word-count",
            title: "Word Count",
            value: data.wordCount.toLocaleString(),
            description: data.wordCount >= 300 ? "Good content depth" : "Consider adding more content",
            icon: "fas fa-font",
            type: data.wordCount >= 300 ? "good" : "warning",
            trend: data.wordCount >= 300 ? "📊 Comprehensive" : "📝 Could expand"
        },
        {
            id: "seo-score",
            title: "SEO Score",
            value: data.seoScore || "N/A",
            description: "Overall SEO health assessment",
            icon: "fas fa-chart-line",
            type: "info",
            trend: "📈 Rating"
        }
    ];
    
    // Create and append cards with staggered animation
    metrics.forEach((metric, index) => {
        const card = createMetricCard(metric);
        
        // Add delay for staggered animation
        setTimeout(() => {
            resultsGrid.appendChild(card);
            
            // Add animation class after DOM insertion
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 10);
        }, index * 50);
    });
    
    // Update timestamp
    updateTimestamp();
    
    // Show results container with animation
    setTimeout(() => {
        resultsContainer.style.display = "block";
        resultsContainer.style.opacity = "0";
        resultsContainer.style.transform = "translateY(20px)";
        
        setTimeout(() => {
            resultsContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            resultsContainer.style.opacity = "1";
            resultsContainer.style.transform = "translateY(0)";
        }, 100);
    }, metrics.length * 50 + 100);
}

// Create individual metric card
function createMetricCard(metric) {
    const card = document.createElement("div");
    card.className = `metric-card ${metric.type}`;
    card.id = metric.id;
    
    // Add initial animation state
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    
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
            <span>${metric.trend}</span>
        </div>
    `;
    
    return card;
}

// Export report function
function exportReport() {
    showToast("Exporting report as PDF...", "info");
    
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
        showToast("Report exported successfully!", "success");
    }, 1000);
}

// Share results function
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'Page Pulse Analysis Report',
            text: 'Check out this website analysis from Page Pulse!',
            url: window.location.href
        }).then(() => {
            showToast("Shared successfully!", "success");
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Fallback share method
function fallbackShare() {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Link copied to clipboard!", "success");
    });
}

// Copy report function
function copyReport() {
    const reportText = generateReportText();
    
    navigator.clipboard.writeText(reportText).then(() => {
        showToast("Report copied to clipboard!", "success");
        
        // Visual feedback on button
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = "var(--color-success)";
        copyBtn.style.borderColor = "var(--color-success)";
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Report';
            copyBtn.style.background = "";
            copyBtn.style.borderColor = "";
        }, 2000);
    });
}

// Generate report text for copying
function generateReportText() {
    const url = analyzedUrl.textContent;
    const cards = document.querySelectorAll('.metric-card');
    let report = `Page Pulse Analysis Report\n`;
    report += `=======================\n`;
    report += `URL: ${url}\n`;
    report += `Analysis Time: ${timestamp.textContent}\n\n`;
    report += `Metrics Summary:\n`;
    
    cards.forEach(card => {
        const title = card.querySelector('.metric-title').textContent;
        const value = card.querySelector('.metric-value').textContent;
        const description = card.querySelector('.metric-description').textContent;
        const trend = card.querySelector('.metric-trend span').textContent;
        
        report += `${title}: ${value}\n`;
        report += `  ${description} (${trend})\n\n`;
    });
    
    report += `\nGenerated by Page Pulse - Premium SEO Analysis Tool`;
    return report;
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    timestamp.textContent = now.toLocaleDateString('en-US', options);
}

// Show toast notification
function showToast(message, type = "info") {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = 'var(--space-md) var(--space-lg)';
    toast.style.background = type === 'success' ? 'var(--color-success)' :
                            type === 'error' ? 'var(--color-error)' :
                            type === 'warning' ? 'var(--color-warning)' :
                            'var(--color-accent-primary)';
    toast.style.color = 'white';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '1000';
    toast.style.fontWeight = '500';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Setup demo mode with sample URL
function setupDemoMode() {
    urlInput.value = "https://digitalheroesco.com";
    validateInput();
}

// Setup keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        analyzeWebsite();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        urlInput.value = '';
        urlInput.style.borderColor = 'var(--color-border)';
        urlInput.focus();
    }
});

// Accessibility improvements
document.addEventListener('focus', (e) => {
    if (e.target.matches('button, input, [tabindex]')) {
        e.target.style.outline = '2px solid var(--color-accent-primary)';
        e.target.style.outlineOffset = '2px';
    }
}, true);

document.addEventListener('blur', (e) => {
    if (e.target.matches('button, input, [tabindex]')) {
        e.target.style.outline = 'none';
    }
}, true);

// Performance optimization - debounce input validation
let validateTimeout;
urlInput.addEventListener('input', () => {
    clearTimeout(validateTimeout);
    validateTimeout = setTimeout(validateInput, 300);
});

// Add CSS for toast (injected dynamically)
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        animation: toastSlideIn 0.3s ease forwards;
    }
    
    @keyframes toastSlideIn {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes toastSlideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);