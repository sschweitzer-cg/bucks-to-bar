/**
 * Data import and export module
 * @module import-export
 */

import { CATEGORY_LABELS } from './constants.js';
import { appState } from './state.js';
import { saveToLocalStorage } from './storage.js';

/**
 * Exports transactions as CSV file
 */
export function exportCSV() {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = appState.transactions.map(t => [
        t.date,
        t.type,
        CATEGORY_LABELS[t.category],
        t.amount.toFixed(2),
        `"${t.description.replace(/"/g, '""')}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    downloadFile(csv, `bucks2bar_transactions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

/**
 * Exports transactions as JSON file
 */
export function exportJSON() {
    const data = {
        exportDate: new Date().toISOString(),
        transactions: appState.transactions
    };
    
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `bucks2bar_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
}

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Handles file import from file input
 * @param {Event} event - File input change event
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 */
export function handleImportFile(event, renderCallback, updateInsightsCallback) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            let transactions;
            if (fileExtension === 'json') {
                transactions = parseImportedJSON(content);
            } else if (fileExtension === 'csv') {
                transactions = parseImportedCSV(content);
            } else {
                alert('Unsupported file format. Please use CSV or JSON files.');
                return;
            }
            
            if (transactions && transactions.length > 0) {
                importData(transactions, renderCallback, updateInsightsCallback);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import data. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
}

/**
 * Parses imported JSON content
 * @param {string} content - JSON string
 * @returns {Array|null} Validated transactions or null
 */
function parseImportedJSON(content) {
    const data = JSON.parse(content);
    const transactions = data.transactions || data;
    
    return validateTransactions(transactions);
}

/**
 * Parses imported CSV content
 * @param {string} content - CSV string
 * @returns {Array|null} Validated transactions or null
 */
function parseImportedCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
        alert('CSV file is empty or invalid.');
        return null;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    const transactions = [];
    
    for (let line of dataLines) {
        // Simple CSV parser (handles quoted descriptions)
        const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 5) continue;
        
        const [date, type, category, amount, description] = matches.map(m => m.replace(/^"|"$/g, '').trim());
        
        // Find category key from label
        let categoryKey = Object.keys(CATEGORY_LABELS).find(
            key => CATEGORY_LABELS[key].toLowerCase() === category.toLowerCase()
        );
        
        if (!categoryKey) {
            categoryKey = category.toLowerCase().replace(/\s+/g, '-');
        }
        
        transactions.push({
            date,
            type: type.toLowerCase(),
            category: categoryKey,
            amount: parseFloat(amount),
            description: description.replace(/""/g, '"')
        });
    }
    
    return validateTransactions(transactions);
}

/**
 * Validates imported transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array|null} Valid transactions or null
 */
function validateTransactions(transactions) {
    if (!Array.isArray(transactions)) {
        alert('Invalid data format.');
        return null;
    }
    
    const validTransactions = [];
    const errors = [];
    
    for (let i = 0; i < transactions.length; i++) {
        const t = transactions[i];
        const issues = [];
        
        // Validate required fields
        if (!t.type || !['income', 'expense'].includes(t.type)) {
            issues.push('invalid type');
        }
        if (!t.amount || isNaN(t.amount) || t.amount <= 0) {
            issues.push('invalid amount');
        }
        if (!t.category) {
            issues.push('missing category');
        }
        if (!t.date || isNaN(new Date(t.date).getTime())) {
            issues.push('invalid date');
        }
        if (!t.description || t.description.trim() === '') {
            issues.push('missing description');
        }
        
        if (issues.length > 0) {
            errors.push(`Row ${i + 1}: ${issues.join(', ')}`);
        } else {
            validTransactions.push(t);
        }
    }
    
    if (errors.length > 0 && errors.length < 10) {
        console.warn('Import warnings:', errors);
    }
    
    if (validTransactions.length === 0) {
        alert('No valid transactions found in the file.');
        return null;
    }
    
    return validTransactions;
}

/**
 * Imports validated transactions into application state
 * @param {Array} transactions - Validated transactions
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 */
function importData(transactions, renderCallback, updateInsightsCallback) {
    if (!confirm(`Import ${transactions.length} transaction(s)? This will add them to your existing data.`)) {
        return;
    }
    
    // Add new transactions with unique IDs and timestamps
    transactions.forEach(t => {
        const newTransaction = {
            id: crypto.randomUUID(),
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: t.date,
            description: t.description,
            timestamp: new Date(t.date).getTime()
        };
        appState.transactions.push(newTransaction);
    });
    
    // Sort transactions by timestamp (newest first)
    appState.transactions.sort((a, b) => b.timestamp - a.timestamp);
    
    saveToLocalStorage();
    renderCallback();
    updateInsightsCallback();
    
    alert(`Successfully imported ${transactions.length} transaction(s)!`);
}
