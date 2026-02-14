/**
 * Transaction management module
 * @module transactions
 */

import { appState, setEditingId } from './state.js';
import { saveToLocalStorage } from './storage.js';

/**
 * Adds a new transaction to the application state
 * @param {Object} transaction - Transaction data (without id and timestamp)
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 */
export function addTransaction(transaction, renderCallback, updateInsightsCallback) {
    const newTransaction = {
        id: crypto.randomUUID(),
        ...transaction,
        timestamp: new Date(transaction.date).getTime()
    };
    
    appState.transactions.unshift(newTransaction);
    saveToLocalStorage();
    renderCallback();
    updateInsightsCallback();
}

/**
 * Updates an existing transaction
 * @param {string} id - Transaction ID
 * @param {Object} updates - Fields to update
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 * @returns {boolean} True if transaction was found and updated
 */
export function updateTransaction(id, updates, renderCallback, updateInsightsCallback) {
    const transaction = appState.transactions.find(t => t.id === id);
    if (!transaction) return false;
    
    Object.assign(transaction, updates);
    transaction.timestamp = new Date(transaction.date).getTime();
    
    // Re-sort transactions by timestamp
    appState.transactions.sort((a, b) => b.timestamp - a.timestamp);
    
    saveToLocalStorage();
    renderCallback();
    updateInsightsCallback();
    return true;
}

/**
 * Deletes a transaction
 * @param {string} id - Transaction ID
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 */
export function deleteTransaction(id, renderCallback, updateInsightsCallback) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderCallback();
        updateInsightsCallback();
    }
}

/**
 * Prepares a transaction for editing
 * @param {string} id - Transaction ID
 * @param {function} populateFormCallback - Callback to populate the form
 * @returns {Object|null} Transaction object or null if not found
 */
export function startEdit(id, populateFormCallback) {
    const transaction = appState.transactions.find(t => t.id === id);
    if (!transaction) return null;
    
    setEditingId(id);
    populateFormCallback(transaction);
    return transaction;
}

/**
 * Cancels the current edit operation
 * @param {function} resetFormCallback - Callback to reset the form
 */
export function cancelEdit(resetFormCallback) {
    setEditingId(null);
    resetFormCallback();
}

/**
 * Initializes demo data for first-time users
 */
export function initializeDemoData() {
    appState.transactions = [
        {
            id: crypto.randomUUID(),
            type: 'income',
            amount: 4500,
            category: 'salary',
            description: 'January Salary',
            date: '2026-01-31',
            timestamp: new Date('2026-01-31').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'expense',
            amount: 1200,
            category: 'rent',
            description: 'January Rent Payment',
            date: '2026-01-05',
            timestamp: new Date('2026-01-05').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'expense',
            amount: 320,
            category: 'groceries',
            description: 'Weekly grocery shopping',
            date: '2026-01-15',
            timestamp: new Date('2026-01-15').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'expense',
            amount: 85,
            category: 'utilities',
            description: 'Electric bill',
            date: '2026-01-20',
            timestamp: new Date('2026-01-20').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'income',
            amount: 800,
            category: 'freelance',
            description: 'Website design project',
            date: '2026-02-05',
            timestamp: new Date('2026-02-05').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'expense',
            amount: 150,
            category: 'entertainment',
            description: 'Concert tickets',
            date: '2026-02-10',
            timestamp: new Date('2026-02-10').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'expense',
            amount: 245,
            category: 'groceries',
            description: 'Monthly grocery shopping',
            date: '2026-02-12',
            timestamp: new Date('2026-02-12').getTime()
        },
        {
            id: crypto.randomUUID(),
            type: 'income',
            amount: 4500,
            category: 'salary',
            description: 'February Salary',
            date: '2026-02-28',
            timestamp: new Date('2026-02-28').getTime()
        }
    ];
    
    // Sort by date (newest first)
    appState.transactions.sort((a, b) => b.timestamp - a.timestamp);
    saveToLocalStorage();
}
