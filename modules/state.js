/**
 * State management module
 * @module state
 */

/**
 * Application state container
 * @typedef {Object} AppState
 * @property {Array<Transaction>} transactions - List of all transactions
 * @property {string} currentFilter - Current month filter ('all' or YYYY-MM format)
 * @property {string} searchQuery - Current search query string
 * @property {string|null} editingId - ID of transaction being edited, null if not editing
 */

/**
 * Transaction object structure
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier (UUID)
 * @property {'income'|'expense'} type - Transaction type
 * @property {number} amount - Transaction amount
 * @property {string} category - Category key
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} description - Transaction description
 * @property {number} timestamp - Unix timestamp for sorting
 */

/**
 * Global application state
 * @type {AppState}
 */
export const appState = {
    transactions: [],
    currentFilter: 'all',
    searchQuery: '',
    editingId: null
};

/**
 * Gets filtered transactions based on current filter and search query
 * @returns {Array<Transaction>} Filtered transactions
 */
export function getFilteredTransactions() {
    let filtered = appState.transactions;
    
    // Filter by month
    if (appState.currentFilter !== 'all') {
        filtered = filtered.filter(t => t.date.startsWith(appState.currentFilter));
    }
    
    // Filter by search query
    if (appState.searchQuery.trim() !== '') {
        const query = appState.searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.description.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

/**
 * Sets the current month filter
 * @param {string} filter - Filter value ('all' or YYYY-MM format)
 */
export function setFilter(filter) {
    appState.currentFilter = filter;
}

/**
 * Sets the search query
 * @param {string} query - Search query string
 */
export function setSearchQuery(query) {
    appState.searchQuery = query;
}

/**
 * Sets the editing transaction ID
 * @param {string|null} id - Transaction ID or null to clear
 */
export function setEditingId(id) {
    appState.editingId = id;
}
