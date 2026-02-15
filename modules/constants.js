/**
 * Application constants and configuration values
 * @module constants
 */

/**
 * Available transaction categories by type
 * @constant {Object}
 */
export const CATEGORIES = {
    income: ['salary', 'freelance', 'investments', 'other-income'],
    expense: ['groceries', 'rent', 'utilities', 'transport', 'entertainment', 'other-expense']
};

/**
 * Human-readable labels for categories
 * @constant {Object}
 */
export const CATEGORY_LABELS = {
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

/**
 * Default budget limits for expense categories
 * @constant {Object}
 */
export const DEFAULT_BUDGETS = {
    'groceries': 500,
    'rent': 1500,
    'utilities': 200,
    'transport': 300,
    'entertainment': 200,
    'other-expense': 300
};

/**
 * LocalStorage configuration
 * @constant {Object}
 */
export const STORAGE_CONFIG = {
    KEY: 'bucks2bar_data',
    BUDGETS_KEY: 'bucks2bar_budgets',
    DARK_MODE_KEY: 'bucks2bar_dark_mode',
    VERSION: '1.0',
    QUOTA_LIMIT: 5 * 1024 * 1024, // 5MB typical quota
    WARNING_THRESHOLD: 0.8 // 80% usage threshold
};
