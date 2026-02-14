/**
 * UI management module
 * @module ui
 */

import { CATEGORIES, CATEGORY_LABELS } from './constants.js';
import { appState, getFilteredTransactions, setFilter, setSearchQuery, setEditingId } from './state.js';

/**
 * Switches between Data and Insights tabs
 * @param {string} tabName - Tab name ('data' or 'insights')
 * @param {function} updateInsightsCallback - Callback to update insights when switching to insights tab
 */
export function switchTab(tabName, updateInsightsCallback) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update insights when switching to insights tab
    if (tabName === 'insights') {
        updateInsightsCallback();
    }
}

/**
 * Updates category dropdown options based on selected transaction type
 */
export function updateCategoryOptions() {
    const typeRadios = document.querySelectorAll('input[name="type"]');
    const categorySelect = document.getElementById('category');
    
    typeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const type = this.value;
            categorySelect.innerHTML = '';
            
            CATEGORIES[type].forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = CATEGORY_LABELS[cat];
                categorySelect.appendChild(option);
            });
        });
    });
    
    // Initialize with currently selected type
    const type = document.querySelector('input[name="type"]:checked').value;
    categorySelect.innerHTML = '';
    CATEGORIES[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = CATEGORY_LABELS[cat];
        categorySelect.appendChild(option);
    });
}

/**
 * Renders the transaction list
 */
export function renderTransactions() {
    const container = document.getElementById('transactions-container');
    const transactions = getFilteredTransactions();
    
    // Update result count
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        const isFiltering = appState.currentFilter !== 'all' || appState.searchQuery.trim() !== '';
        if (isFiltering) {
            resultCount.textContent = `${transactions.length} result${transactions.length !== 1 ? 's' : ''}`;
            resultCount.style.display = 'inline';
        } else {
            resultCount.style.display = 'none';
        }
    }
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No transactions found</h3>
                <p>${appState.searchQuery ? 'Try a different search term' : 'Add your first transaction to get started!'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map(t => {
        const date = new Date(t.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        return `
            <div class="transaction-item">
                <div class="transaction-date">${date}</div>
                <div class="transaction-type ${t.type}">${t.type === 'income' ? '💵 Income' : '💸 Expense'}</div>
                <div>
                    <div class="transaction-description">${t.description}</div>
                    <div class="transaction-category">${CATEGORY_LABELS[t.category]}</div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </div>
                <div class="transaction-actions">
                    <button class="btn-small btn-edit" onclick="window.handleStartEdit('${t.id}')">Edit</button>
                    <button class="btn-small btn-delete" onclick="window.handleDeleteTransaction('${t.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filters transactions by month
 */
export function filterTransactions() {
    const monthFilter = document.getElementById('month-filter').value;
    setFilter(monthFilter);
    renderTransactions();
}

/**
 * Searches transactions by description
 */
export function searchTransactions() {
    const searchInput = document.getElementById('search-input');
    setSearchQuery(searchInput.value);
    renderTransactions();
}

/**
 * Resets the transaction form to default values
 */
export function resetForm() {
    document.getElementById('transaction-form').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    updateCategoryOptions();
}

/**
 * Populates form with transaction data for editing
 * @param {Object} transaction - Transaction to edit
 */
export function populateFormForEdit(transaction) {
    // Switch to Data tab if needed
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('.tab-button').classList.add('active');
    document.getElementById('data-tab').classList.add('active');
    
    // Populate form
    document.getElementById(`type-${transaction.type}`).checked = true;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('date').value = transaction.date;
    document.getElementById('description').value = transaction.description;
    
    // Update category options and select category
    updateCategoryOptions();
    document.getElementById('category').value = transaction.category;
    
    // Update button text and show cancel button
    document.querySelector('#transaction-form .btn-primary').textContent = 'Update Transaction';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Resets edit state UI elements
 */
export function resetEditState() {
    setEditingId(null);
    document.querySelector('#transaction-form .btn-primary').textContent = 'Add Transaction';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    resetForm();
}
