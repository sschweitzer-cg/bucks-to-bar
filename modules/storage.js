/**
 * LocalStorage operations module
 * @module storage
 */

import { STORAGE_CONFIG } from './constants.js';
import { appState } from './state.js';

/**
 * Saves application data to localStorage
 * @throws {Error} If save operation fails
 */
export function saveToLocalStorage() {
    try {
        const data = {
            version: STORAGE_CONFIG.VERSION,
            lastModified: Date.now(),
            transactions: appState.transactions
        };
        localStorage.setItem(STORAGE_CONFIG.KEY, JSON.stringify(data));
        checkLocalStorageQuota();
    } catch (e) {
        console.error('Failed to save data:', e);
        throw new Error('Failed to save data. Storage might be full.');
    }
}

/**
 * Loads application data from localStorage
 * @returns {boolean} True if data was loaded successfully
 */
export function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_CONFIG.KEY);
        if (stored) {
            const data = JSON.parse(stored);
            appState.transactions = data.transactions || [];
            return true;
        }
    } catch (e) {
        console.error('Failed to load data:', e);
    }
    return false;
}

/**
 * Saves custom budgets to localStorage
 * @param {Object} budgets - Budget object with category keys and limits
 */
export function saveBudgets(budgets) {
    try {
        localStorage.setItem(STORAGE_CONFIG.BUDGETS_KEY, JSON.stringify(budgets));
    } catch (e) {
        console.error('Failed to save budgets:', e);
    }
}

/**
 * Loads custom budgets from localStorage
 * @returns {Object|null} Budget object or null if not found
 */
export function loadBudgets() {
    try {
        const stored = localStorage.getItem(STORAGE_CONFIG.BUDGETS_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load budgets:', e);
    }
    return null;
}

/**
 * Checks localStorage quota usage and shows warning if needed
 */
export function checkLocalStorageQuota() {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        
        const usagePercent = (totalSize / STORAGE_CONFIG.QUOTA_LIMIT) * 100;
        
        if (usagePercent > STORAGE_CONFIG.WARNING_THRESHOLD * 100) {
            showStorageWarning(usagePercent.toFixed(1));
        } else {
            hideStorageWarning();
        }
    } catch (e) {
        console.error('Failed to check quota:', e);
    }
}

/**
 * Shows storage warning banner
 * @param {string} percent - Usage percentage
 */
function showStorageWarning(percent) {
    let banner = document.getElementById('storage-warning-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'storage-warning-banner';
        banner.className = 'storage-warning';
        banner.innerHTML = `
            <div class="storage-warning-content">
                <span class="storage-warning-icon">⚠️</span>
                <div class="storage-warning-text">
                    <strong>Storage Warning:</strong> You're using ${percent}% of available space.
                    <a href="#" onclick="event.preventDefault(); exportJSON(); hideStorageWarning();">Export your data</a> to backup.
                </div>
                <button class="storage-warning-close" onclick="hideStorageWarning()" aria-label="Close warning">✕</button>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }
    banner.style.display = 'block';
}

/**
 * Hides storage warning banner
 */
function hideStorageWarning() {
    const banner = document.getElementById('storage-warning-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

/**
 * Saves dark mode preference to localStorage
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
export function saveDarkMode(isDarkMode) {
    try {
        localStorage.setItem(STORAGE_CONFIG.DARK_MODE_KEY, JSON.stringify(isDarkMode));
    } catch (e) {
        console.error('Failed to save dark mode preference:', e);
    }
}

/**
 * Loads dark mode preference from localStorage
 * @returns {boolean} Dark mode preference (defaults to false)
 */
export function loadDarkMode() {
    try {
        const stored = localStorage.getItem(STORAGE_CONFIG.DARK_MODE_KEY);
        if (stored !== null) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load dark mode preference:', e);
    }
    return false; // Default to light mode
}

// Make hideStorageWarning globally accessible for inline onclick handlers
window.hideStorageWarning = hideStorageWarning;
