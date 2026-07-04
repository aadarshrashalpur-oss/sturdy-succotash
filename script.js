// Global variables
let currentEmail = '';
let currentDomain = '@sendhelpdad.mail';
let timeRemaining = 1200; // 20 minutes in seconds
let timerInterval = null;
let emailInbox = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateNewEmail();
    startTimer();
    loadEmailsFromStorage();
});

// Generate random email prefix
function generateEmailPrefix() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let prefix = '';
    for (let i = 0; i < 15; i++) {
        prefix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix;
}

// Generate new email
function generateNewEmail() {
    const domain = document.getElementById('domainSelect').value || '@sendhelpdad.mail';
    currentDomain = domain;
    const prefix = generateEmailPrefix();
    currentEmail = prefix + domain;
    
    // Display email
    document.getElementById('emailText').textContent = prefix;
    
    // Reset timer
    timeRemaining = 1200;
    updateTimerDisplay();
    
    // Save to localStorage
    saveEmailToStorage();
    
    // Clear inbox for new email
    emailInbox = [];
    updateInboxDisplay();
}

// Copy email to clipboard
function copyEmail() {
    const fullEmail = document.getElementById('emailText').textContent + currentDomain;
    navigator.clipboard.writeText(fullEmail).then(() => {
        showNotification('Email copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy email');
    });
}

// Regenerate email
function regenerateEmail() {
    generateNewEmail();
    showNotification('New temporary email generated!');
}

// Timer functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            generateNewEmail();
            showNotification('Email expired. New one generated!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timer').textContent = display;
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Storage functions
function saveEmailToStorage() {
    const emailData = {
        email: currentEmail,
        prefix: document.getElementById('emailText').textContent,
        domain: currentDomain,
        timestamp: new Date().getTime(),
        timeRemaining: timeRemaining
    };
    localStorage.setItem('currentEmail', JSON.stringify(emailData));
}

function loadEmailsFromStorage() {
    const stored = localStorage.getItem('currentEmail');
    if (stored) {
        const emailData = JSON.parse(stored);
        const elapsed = Math.floor((new Date().getTime() - emailData.timestamp) / 1000);
        const remaining = emailData.timeRemaining - elapsed;
        
        if (remaining > 0) {
            document.getElementById('emailText').textContent = emailData.prefix;
            currentEmail = emailData.email;
            currentDomain = emailData.domain;
            document.getElementById('domainSelect').value = emailData.domain;
            timeRemaining = remaining;
            updateTimerDisplay();
        } else {
            generateNewEmail();
        }
    }
}

// Inbox functions
function updateInboxDisplay() {
    const emailsList = document.getElementById('emailsList');
    const inboxStatus = document.getElementById('inboxStatus');
    
    if (emailInbox.length === 0) {
        emailsList.innerHTML = `
            <div class="empty-state">
                <p>Waiting for emails...</p>
                <p class="empty-subtext">Emails will appear here when received</p>
            </div>
        `;
        inboxStatus.textContent = 'No emails yet';
        return;
    }
    
    inboxStatus.textContent = `${emailInbox.length} email${emailInbox.length > 1 ? 's' : ''}`;
    
    emailsList.innerHTML = emailInbox.map((email, index) => `
        <div class="email-item" onclick="openEmail(${index})">
            <div class="email-from">From: ${email.from}</div>
            <div class="email-subject">Subject: ${email.subject}</div>
            <div class="email-time">${new Date(email.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

function openEmail(index) {
    const email = emailInbox[index];
    const modal = document.getElementById('emailModal');
    
    document.getElementById('modalHeader').innerHTML = `
        <div>
            <div>From: ${email.from}</div>
            <div>Subject: ${email.subject}</div>
            <div style="font-size: 12px; color: var(--dark-gray); margin-top: 10px;">${new Date(email.timestamp).toLocaleString()}</div>
        </div>
    `;
    
    document.getElementById('modalBody').innerHTML = email.body;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('emailModal').classList.remove('active');
}

// Simulate receiving emails (for demo purposes)
function simulateReceiveEmail() {
    const senders = ['Discord', 'Gmail', 'GitHub', 'Twitter', 'Reddit'];
    const subjects = ['Verify your email', 'Confirm your account', 'Welcome!', 'Account confirmation', 'Email verification'];
    
    const newEmail = {
        from: senders[Math.floor(Math.random() * senders.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        body: `<p>Thank you for signing up!</p><p>Please verify your email address to continue.</p><p><a href="#" style="color: var(--white); text-decoration: underline;">Verify Email</a></p>`,
        timestamp: new Date().getTime()
    };
    
    emailInbox.push(newEmail);
    updateInboxDisplay();
    showNotification('New email received!');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('emailModal');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal.classList.contains('active') && e.target === modal) {
        closeModal();
    }
});

// Demo: Add test email every 30 seconds (remove in production)
// setInterval(() => {
//     if (emailInbox.length < 5) {
//         simulateReceiveEmail();
//     }
// }, 30000);