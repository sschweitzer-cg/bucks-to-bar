# Bucks2Bar - AI Coding Instructions

## Architecture Overview

**Bucks2Bar** is a **modular ES6 client-side expense tracker** with NO build process and NO backend. All code runs in the browser using vanilla JavaScript modules.

### Key Architecture Pattern: Callback-Based Module Orchestration

The app uses **dependency injection via callbacks** instead of tight coupling. Modules export pure functions that accept callbacks to trigger side effects (UI updates, insights refresh). This enables:
- Testing modules in isolation
- Clear data flow (state → storage → UI)
- Easy migration to frameworks later (state management already separated)

**Critical:** `script.js` is the **orchestrator** that wires modules together. It imports functions and passes render/update callbacks down to business logic modules.

## Module Structure & Responsibilities

```
modules/
├── constants.js      - CATEGORIES, DEFAULT_BUDGETS, STORAGE_CONFIG (single source of truth)
├── state.js          - appState object + getFilteredTransactions() (centralized state)
├── storage.js        - LocalStorage CRUD + quota monitoring (5MB limit awareness)
├── transactions.js   - Business logic: addTransaction(), updateTransaction(), deleteTransaction()
├── ui.js            - DOM manipulation: renderTransactions(), switchTab(), resetForm()
├── charts.js        - Chart.js integration: updateInsights() renders all charts
└── import-export.js - CSV/JSON export/import with validation
```

**Entry point:** `script.js` (135 lines) - Sets up event listeners, initializes app

## Code Patterns You MUST Follow

### 1. Module Exports Pattern
```javascript
// ✅ CORRECT: Export named functions
export function addTransaction(data, renderCallback, updateCallback) {
  // Business logic here
  saveToLocalStorage();
  renderCallback();      // Trigger UI update
  updateCallback();      // Trigger insights update
}

// ❌ WRONG: Don't export classes or default exports (not used in this codebase)
```

### 2. Callback Injection for Side Effects
When modifying `transactions.js` or `storage.js`:
```javascript
// ✅ CORRECT: Accept callbacks for UI updates
export function deleteTransaction(id, renderCallback, updateCallback) {
  appState.transactions = appState.transactions.filter(t => t.id !== id);
  saveToLocalStorage();
  renderCallback();     // Don't call renderTransactions() directly!
  updateCallback();
}
```

**Why:** This keeps modules decoupled. `transactions.js` doesn't import from `ui.js`.

### 3. State Management Rules
- **ALL state lives in `state.js`:** `appState` object is the single source of truth
- **Never mutate state in UI modules:** Only `transactions.js` modifies `appState.transactions`
- **Use state setters:** `setFilter()`, `setSearchQuery()`, `setEditingId()` in `state.js`

```javascript
// ✅ CORRECT: Use setter from state.js
import { setEditingId } from './modules/state.js';
setEditingId(transaction.id);

// ❌ WRONG: Direct mutation
appState.editingId = transaction.id;
```

### 4. LocalStorage Quota Awareness
**Critical:** Storage has ~5MB limit. The app monitors this via `checkLocalStorageQuota()`.

When adding storage features:
```javascript
import { saveToLocalStorage, checkLocalStorageQuota } from './modules/storage.js';

// Always check quota before large operations
checkLocalStorageQuota();  // Shows warning if > 80% used
saveToLocalStorage();
```

### 5. Transaction Object Structure
**DO NOT change this schema without updating storage.js:**
```javascript
{
  id: "uuid-string",           // crypto.randomUUID()
  type: "income" | "expense",  // MUST be one of these two strings
  amount: 123.45,              // Number (not string!)
  category: "groceries",       // Key from CATEGORIES in constants.js
  date: "2026-02-14",          // YYYY-MM-DD format (ISO 8601 date part)
  description: "Weekly shopping",
  timestamp: 1708012800000     // Unix timestamp for sorting
}
```

### 6. JSDoc Type Annotations
**All modules use JSDoc for type safety** (no TypeScript build). Continue this pattern:
```javascript
/**
 * Adds a new transaction
 * @param {Object} transaction - Transaction data
 * @param {function} renderCallback - Callback to re-render UI
 * @param {function} updateInsightsCallback - Callback to update insights
 */
export function addTransaction(transaction, renderCallback, updateInsightsCallback) {
  // ...
}
```

## Critical Workflows

### Running Locally
```powershell
# Must use local server (ES6 modules require http://)
npm install -g http-server
http-server -p 8080 -o
```
**Do NOT open index.html directly in browser** - ES6 modules fail with `file://` protocol.

### Testing Changes
1. Make code changes
2. Refresh browser (no build step!)
3. Check browser console for errors
4. Test in "Data" tab first, then "Insights" tab
5. Verify LocalStorage: DevTools → Application → Local Storage

### Adding a New Feature
1. **Identify which module** (business logic → `transactions.js`, UI → `ui.js`, etc.)
2. **Update constants.js** if adding categories/config
3. **Add state to state.js** if tracking new UI state
4. **Export function from module**
5. **Import and wire in script.js** with callbacks
6. **Update index.html** if new DOM elements needed

## File Modification Guidelines

### When to edit `script.js` (orchestrator)
- Adding new event listeners
- Wiring new module functions with callbacks
- Initializing new features on page load

### When to edit module files
- **constants.js**: Adding categories, changing budgets, config values
- **state.js**: Adding new state properties or filters
- **transactions.js**: Transaction CRUD operations (add recurring transactions here!)
- **ui.js**: DOM manipulation, rendering, form handling
- **charts.js**: Chart.js visualizations (all charts rendered here)
- **import-export.js**: CSV/JSON export/import logic

### When to edit `index.html`
- Adding form fields, tabs, or new UI sections
- **IMPORTANT:** Still uses `onclick` attributes (legacy pattern). See TODO ID 4 in code review to migrate to event delegation.

## Common Gotchas

1. **Inline onclick handlers:** `index.html` still uses `onclick="switchTab('data')"` - this is intentional for now (works with modules via `window.switchTab`)
2. **Chart.js CDN:** Don't add build process! Charts loaded via CDN in `<head>`
3. **Date format:** Always `YYYY-MM-DD` for `transaction.date` - used for month filtering (`date.startsWith(appState.currentFilter)`)
4. **Demo data:** First-time users get 8 sample transactions from `initializeDemoData()` in `transactions.js`
5. **No error boundaries:** Errors appear in console - always check DevTools when adding features

## Quick Reference

| Task | Module | Key Function |
|------|--------|--------------|
| Add transaction | transactions.js | `addTransaction(data, render, update)` |
| Render list | ui.js | `renderTransactions()` |
| Update charts | charts.js | `updateInsights()` |
| Save data | storage.js | `saveToLocalStorage()` |
| Export CSV | import-export.js | `exportCSV()` |
| Search | ui.js | `searchTransactions()` |

## TODO List - Active Development Items

### **ID 2** - Mobile responsive improvements for transaction grid
**Status:** PENDING | **Priority:** P2 | **Scope:** M  
**Why:** Current `.transaction-item` grid breaks on mobile despite media query  
**Files:** `styles.css`

### **ID 3** - Implement budget customization UI
**Status:** PENDING | **Priority:** P2 | **Scope:** M  
**Why:** `DEFAULT_BUDGETS` constant is hardcoded; users need to set their own limits  
**Approach:** Add "Edit Budgets" button in Insights tab, modal/form to edit, save to localStorage  
**Files:** `index.html`, `modules/ui.js`, `modules/storage.js`, `styles.css`

### **ID 5** - Create recurring transaction feature
**Status:** PENDING | **Priority:** P3 | **Scope:** L  
**Why:** Users manually re-enter monthly bills; automation reduces friction  
**Approach:** Add "Recurring" checkbox to form, store recurrence pattern, auto-generate on date rollover  
**Files:** `index.html`, `modules/transactions.js`, `modules/state.js`, `modules/ui.js`, `styles.css`

### **ID 7** - Implement dark mode toggle
**Status:** ✅ COMPLETED | **Priority:** P3 | **Scope:** M  
**Why:** Reduce eye strain for users in low-light environments  
**Implementation:** Toggle button in header with sun/moon icons, CSS variables for theme switching, localStorage persistence  
**Files Modified:** `index.html`, `modules/constants.js`, `modules/storage.js`, `modules/ui.js`, `script.js`, `styles.css`  
**Features:**
- Animated toggle button in header (top-right)
- Accessible dark color scheme with proper contrast ratios
- Smooth CSS transitions between themes
- Preference persisted to localStorage
- Initializes on page load based on saved preference

### **ID 8** - Add form validation feedback UI
**Status:** PENDING | **Priority:** P2 | **Scope:** S  
**Why:** Current validation uses `alert()` which is intrusive  
**Approach:** Replace alerts with inline error messages, red borders on invalid fields  
**Files:** `modules/ui.js`, `styles.css`

### **ID 9** - Create data clearing/reset functionality
**Status:** PENDING | **Priority:** P2 | **Scope:** S  
**Why:** Users need way to clear demo data or start fresh  
**Approach:** "Clear All Data" button with confirmation, option to export before clearing  
**Files:** `index.html`, `modules/storage.js`, `modules/ui.js`

### **ID 10** - Add keyboard shortcuts for common actions
**Status:** PENDING | **Priority:** P3 | **Scope:** M  
**Why:** Power users benefit from quick access; improves efficiency  
**Shortcuts:** `Ctrl+N`: New transaction, `Ctrl+E`: Export, `Esc`: Cancel edit, `?`: Help  
**Files:** `script.js`, `index.html`, `styles.css`

## Completed Features ✅
- Transaction CRUD operations with edit workflow
- CSV/JSON export and import with validation
- Chart.js integration for visual insights
- Budget tracking with progress bars
- Month-based filtering and description search
- LocalStorage persistence with quota monitoring
- Demo data for first-time users
- Dark mode toggle with localStorage persistence
- Chart.js integration for visual insights
- Budget tracking with progress bars
- Month-based filtering and description search
- LocalStorage persistence with quota monitoring
- Demo data for first-time users
