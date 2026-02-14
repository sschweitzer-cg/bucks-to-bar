/**
 * Charts and insights module
 * @module charts
 */

import { CATEGORY_LABELS, DEFAULT_BUDGETS } from './constants.js';
import { appState } from './state.js';
import { loadBudgets } from './storage.js';

let monthlyChart = null;
let categoryChart = null;
let currentBudgets = null;

/**
 * Gets current budgets (custom or default)
 * @returns {Object} Budget limits object
 */
function getBudgets() {
    if (!currentBudgets) {
        currentBudgets = loadBudgets() || { ...DEFAULT_BUDGETS };
    }
    return currentBudgets;
}

/**
 * Updates all insights (summary cards, charts, and budgets)
 */
export function updateInsights() {
    updateSummaryCards();
    updateCharts();
    updateBudgets();
}

/**
 * Updates summary cards with totals
 */
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

/**
 * Updates both charts
 */
function updateCharts() {
    updateMonthlyChart();
    updateCategoryChart();
}

/**
 * Updates monthly income vs expenses bar chart
 */
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

/**
 * Updates category breakdown pie chart
 */
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

/**
 * Updates budget tracking section
 */
function updateBudgets() {
    const container = document.getElementById('budget-container');
    const budgets = getBudgets();
    
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
    
    const budgetHTML = Object.keys(budgets).map(category => {
        const limit = budgets[category];
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
