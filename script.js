// ==================== DATA STRUCTURE & CONSTANTS ====================

const CATEGORIES = {
    income: ['salary', 'freelance', 'investments', 'other-income'],
    expense: ['groceries', 'rent', 'utilities', 'transport', 'entertainment', 'other-expense']
};

const CATEGORY_LABELS = {
    'salary': 'Salary',
    'freelance': 'Freelance',
    'investments': 'Investments',
    'other-income': 'Other Income',
    'groceries': 'Groceries',
    'rent': 'Rent',
    'utilities': 'Utilities',
    'transport': 'Transport',
    'entertainment': 'Entertainment',
    'other-expense': 'Other Expense'
};

const BUDGETS = {
    'groceries': 500,
    'rent': 1500,
    'utilities': 200,
    'transport': 300,
    'entertainment': 200,
    'other-expense': 300
};

// ==================== STATE MANAGEMENT ====================

let appState = {
    transactions: [],
    currentFilter: 'all',
    editingId: null
};

// ==================== LOCAL STORAGE ====================

function saveToLocalStorage() {
    try {
        const data = {
            version: '1.0',
            lastModified: Date.now(),
            transactions: appState.transactions
        };
        localStorage.setItem('bucks2bar_data', JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save data:', e);
        alert('Failed to save data. Storage might be full.');
    }
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('bucks2bar_data');
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

function initializeDemoData() {
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

// ==================== TRANSACTION MANAGEMENT ====================

function addTransaction(transaction) {
    const newTransaction = {
        id: crypto.randomUUID(),
        ...transaction,
        timestamp: new Date(transaction.date).getTime()
    };
    
    appState.transactions.unshift(newTransaction);
    saveToLocalStorage();
    renderTransactions();
    updateInsights();
}

function startEdit(id) {
    const transaction = appState.transactions.find(t => t.id === id);
    if (!transaction) return;
    
    appState.editingId = id;
    
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

function resetEditState() {
    appState.editingId = null;
    document.querySelector('#transaction-form .btn-primary').textContent = 'Add Transaction';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    resetForm();
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTransactions();
        updateInsights();
    }
}

function getFilteredTransactions() {
    if (appState.currentFilter === 'all') {
        return appState.transactions;
    }
    
    return appState.transactions.filter(t => {
        return t.date.startsWith(appState.currentFilter);
    });
}

// ==================== UI MANAGEMENT ====================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update insights when switching to insights tab
    if (tabName === 'insights') {
        updateInsights();
    }
}

function updateCategoryOptions() {
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
    
    // Initialize with income categories
    const type = document.querySelector('input[name="type"]:checked').value;
    categorySelect.innerHTML = '';
    CATEGORIES[type].forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = CATEGORY_LABELS[cat];
        categorySelect.appendChild(option);
    });
}

function renderTransactions() {
    const container = document.getElementById('transactions-container');
    const transactions = getFilteredTransactions();
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No transactions yet</h3>
                <p>Add your first transaction to get started!</p>
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
                    <button class="btn-small btn-edit" onclick="startEdit('${t.id}')">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteTransaction('${t.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterTransactions() {
    const monthFilter = document.getElementById('month-filter').value;
    appState.currentFilter = monthFilter;
    renderTransactions();
}

function resetForm() {
    document.getElementById('transaction-form').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    updateCategoryOptions();
}

// ==================== FORM HANDLING ====================

function setupFormHandling() {
    const form = document.getElementById('transaction-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value.trim();
        
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
            const transaction = appState.transactions.find(t => t.id === appState.editingId);
            if (transaction) {
                transaction.type = type;
                transaction.amount = amount;
                transaction.category = category;
                transaction.date = date;
                transaction.description = description;
                transaction.timestamp = new Date(date).getTime();
                
                // Re-sort transactions
                appState.transactions.sort((a, b) => b.timestamp - a.timestamp);
                saveToLocalStorage();
                renderTransactions();
                updateInsights();
            }
            resetEditState();
        } else {
            // Add new transaction
            addTransaction({
                type,
                amount,
                category,
                date,
                description
            });
            resetForm();
        }
    });
    
    // Set today's date as default
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

// ==================== INSIGHTS & CHARTS ====================

let monthlyChart = null;
let categoryChart = null;

function updateInsights() {
    updateSummaryCards();
    updateCharts();
    updateBudgets();
}

function updateSummaryCards() {
    const totalIncome = appState.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = appState.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('net-balance').textContent = `$${netBalance.toFixed(2)}`;
}

function updateCharts() {
    updateMonthlyChart();
    updateCategoryChart();
}

function updateMonthlyChart() {
    const monthlyData = {};
    
    // Initialize all months of 2026
    for (let i = 1; i <= 12; i++) {
        const month = `2026-${String(i).padStart(2, '0')}`;
        monthlyData[month] = { income: 0, expense: 0 };
    }
    
    // Aggregate data
    appState.transactions.forEach(t => {
        const month = t.date.substring(0, 7);
        if (monthlyData[month]) {
            monthlyData[month][t.type] += t.amount;
        }
    });
    
    const months = Object.keys(monthlyData).sort();
    const monthLabels = months.map(m => {
        const date = new Date(m + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const incomeData = months.map(m => monthlyData[m].income);
    const expenseData = months.map(m => monthlyData[m].expense);
    
    const ctx = document.getElementById('monthly-chart');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(39, 174, 96, 0.8)',
                    borderColor: 'rgba(39, 174, 96, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function updateCategoryChart() {
    const categoryData = {};
    
    appState.transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            if (!categoryData[t.category]) {
                categoryData[t.category] = 0;
            }
            categoryData[t.category] += t.amount;
        });
    
    const categories = Object.keys(categoryData);
    const amounts = Object.values(categoryData);
    const labels = categories.map(cat => CATEGORY_LABELS[cat]);
    
    const ctx = document.getElementById('category-chart');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const colors = [
        'rgba(231, 76, 60, 0.8)',
        'rgba(52, 152, 219, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(230, 126, 34, 0.8)'
    ];
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateBudgets() {
    const container = document.getElementById('budget-container');
    
    // Calculate current month expenses by category
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthExpenses = {};
    
    appState.transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
        .forEach(t => {
            if (!monthExpenses[t.category]) {
                monthExpenses[t.category] = 0;
            }
            monthExpenses[t.category] += t.amount;
        });
    
    const budgetHTML = Object.keys(BUDGETS).map(category => {
        const limit = BUDGETS[category];
        const spent = monthExpenses[category] || 0;
        const percentage = (spent / limit) * 100;
        
        let progressClass = '';
        if (percentage >= 90) {
            progressClass = 'danger';
        } else if (percentage >= 70) {
            progressClass = 'warning';
        }
        
        return `
            <div class="budget-item">
                <div class="budget-header">
                    <span class="budget-category">${CATEGORY_LABELS[category]}</span>
                    <span class="budget-amount">$${spent.toFixed(2)} / $${limit.toFixed(2)}</span>
                </div>
                <div class="budget-progress">
                    <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = budgetHTML;
}

// ==================== EXPORT FUNCTIONALITY ====================

function exportCSV() {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = appState.transactions.map(t => [
        t.date,
        t.type,
        CATEGORY_LABELS[t.category],
        t.amount.toFixed(2),
        `"${t.description.replace(/"/g, '""')}"`
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bucks2bar_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportJSON() {
    const data = {
        exportDate: new Date().toISOString(),
        transactions: appState.transactions
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bucks2bar_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== IMPORT FUNCTIONALITY ====================

function handleImportFile(event) {
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
                importData(transactions);
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

function parseImportedJSON(content) {
    const data = JSON.parse(content);
    const transactions = data.transactions || data;
    
    return validateTransactions(transactions);
}

function parseImportedCSV(content) {
    const lines = content.trim().split('\\n');
    if (lines.length < 2) {
        alert('CSV file is empty or invalid.');
        return null;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    const transactions = [];
    
    for (let line of dataLines) {
        // Simple CSV parser (handles quoted descriptions)
        const matches = line.match(/(".*?"|[^,]+)(?=\\s*,|\\s*$)/g);
        if (!matches || matches.length < 5) continue;
        
        const [date, type, category, amount, description] = matches.map(m => m.replace(/^"|"$/g, '').trim());
        
        // Find category key from label
        let categoryKey = Object.keys(CATEGORY_LABELS).find(
            key => CATEGORY_LABELS[key].toLowerCase() === category.toLowerCase()
        );
        
        if (!categoryKey) {
            categoryKey = category.toLowerCase().replace(/\\s+/g, '-');
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

function importData(transactions) {
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
    renderTransactions();
    updateInsights();
    
    alert(`Successfully imported ${transactions.length} transaction(s)!`);
}

// ==================== INITIALIZATION ====================

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