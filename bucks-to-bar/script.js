/**
 * Bucks2Bar - Income & Expense Tracker
 * Main application entry point
 * @module main
 */

import { CATEGORIES } from './modules/constants.js';
import { appState } from './modules/state.js';
import { loadFromLocalStorage } from './modules/storage.js';
import { 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    startEdit, 
    cancelEdit,
    initializeDemoData 
} from './modules/transactions.js';
import { 
    switchTab, 
    updateCategoryOptions, 
    renderTransactions, 
    filterTransactions, 
    searchTransactions, 
    resetForm,
    populateFormForEdit,
    resetEditState 
} from './modules/ui.js';
import { updateInsights } from './modules/charts.js';
import { exportCSV, exportJSON, handleImportFile } from './modules/import-export.js';

/**
 * Sets up form submission handling
 */
function setupFormHandling() {
    const form = document.getElementById('transaction-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value.trim();
        
        // Validation
        if (amount <= 0) {
            alert('Amount must be greater than 0');
            return;
        }
        
        if (!description) {
            alert('Please enter a description');
            return;
        }
        
        if (appState.editingId) {
            // Update existing transaction
            updateTransaction(
                appState.editingId,
                { type, amount, category, date, description },
                renderTransactions,
                updateInsights
            );
            resetEditState();
        } else {
            // Add new transaction
            addTransaction(
                { type, amount, category, date, description },
                renderTransactions,
                updateInsights
            );
            resetForm();
        }
    });
    
    // Set today's date as default
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

/**
 * Wrapper functions for global event handlers
 */
function handleStartEdit(id) {
    startEdit(id, populateFormForEdit);
}

function handleDeleteTransaction(id) {
    deleteTransaction(id, renderTransactions, updateInsights);
}

function handleResetEditState() {
    cancelEdit(resetEditState);
}

function handleSwitchTab(tabName) {
    switchTab(tabName, updateInsights);
}

function handleImport(event) {
    handleImportFile(event, renderTransactions, updateInsights);
}

/**
 * Application initialization
 */
window.addEventListener('DOMContentLoaded', function() {
    // Load data or initialize demo data
    const hasData = loadFromLocalStorage();
    if (!hasData) {
        initializeDemoData();
    }
    
    // Setup UI
    updateCategoryOptions();
    setupFormHandling();
    renderTransactions();
    updateInsights();
});

/**
 * Make functions globally accessible for inline event handlers
 * (These will be gradually replaced with proper event listeners in future refactoring)
 */
window.switchTab = handleSwitchTab;
window.filterTransactions = filterTransactions;
window.searchTransactions = searchTransactions;
window.resetForm = resetForm;
window.handleStartEdit = handleStartEdit;
window.handleDeleteTransaction = handleDeleteTransaction;
window.resetEditState = handleResetEditState;
window.exportCSV = exportCSV;
window.exportJSON = exportJSON;
window.handleImportFile = handleImport;
