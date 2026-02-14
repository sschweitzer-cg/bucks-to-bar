# Bucks2Bar - Project TODO List

**Last Updated:** February 14, 2026  
**Status:** Active Development

## Project Overview
Bucks2Bar is a client-side income and expense tracker with:
- ✅ Transaction management (add, edit, delete)
- ✅ CSV/JSON export and import
- ✅ Visual charts and budget tracking
- ✅ LocalStorage persistence
- ✅ Responsive design

---

## Active TODO List

### **ID 1** ✅ Initialize Git repository and create .github structure
**Status:** COMPLETED  
**Priority:** P1 | **Scope:** S  
**Why:** Enable version control, create canonical location for copilot-instructions.md  
**Acceptance Criteria:**
- [x] Git repository initialized with `.gitignore`
- [x] `.github/copilot-instructions.md` created with TODO list
- [x] Initial commit with message "Initial commit: Bucks2Bar expense tracker"

---

### **ID 2** Add mobile responsive improvements for transaction grid
**Status:** PENDING  
**Priority:** P2 | **Scope:** M  
**Why:** Current `.transaction-item` grid breaks on mobile despite media query  
**Acceptance Criteria:**
- [ ] Transaction items stack vertically on screens < 600px
- [ ] Action buttons remain accessible and properly sized
- [ ] Touch targets meet 44px minimum for iOS/Android

**Files to Modify:** `styles.css`

---

### **ID 3** Implement budget customization UI
**Status:** PENDING  
**Priority:** P2 | **Scope:** M  
**Why:** `BUDGETS` constant is hardcoded; users need to set their own budget limits  
**Acceptance Criteria:**
- [ ] Add "Edit Budgets" button in Insights tab
- [ ] Modal/form to edit each category budget
- [ ] Save custom budgets to localStorage
- [ ] Persist across sessions

**Files to Modify:** `index.html`, `script.js`, `styles.css`

---

### **ID 4** ✅ Add data backup warning on localStorage quota
**Status:** COMPLETED (Commit: 623fa4a)  
**Priority:** P1 | **Scope:** S  
**Why:** `saveToLocalStorage()` catches errors but user has no proactive warning  
**Acceptance Criteria:**
- [x] Check localStorage size before save operations
- [x] Show warning banner when > 80% quota used
- [x] Suggest export/cleanup actions

**Files Modified:** `script.js`, `styles.css`

---

### **ID 5** Create recurring transaction feature
**Status:** PENDING  
**Priority:** P3 | **Scope:** L  
**Why:** Users manually re-enter monthly bills; automation reduces friction  
**Acceptance Criteria:**
- [ ] Add "Recurring" checkbox to transaction form
- [ ] Store recurrence pattern (monthly, weekly, custom interval)
- [ ] Auto-generate transactions on date rollover
- [ ] UI to manage recurring templates

**Files to Modify:** `index.html`, `script.js`, `styles.css`

---

### **ID 6** Add transaction search/filter by description
**Status:** PENDING  
**Priority:** P2 | **Scope:** S  
**Why:** Current filter only supports month; users need text search  
**Acceptance Criteria:**
- [ ] Add search input above transaction list
- [ ] Filter in real-time by description (case-insensitive)
- [ ] Combine with existing month filter
- [ ] Show "X results" count

**Files to Modify:** `index.html`, `script.js`

---

### **ID 7** Implement dark mode toggle
**Status:** PENDING  
**Priority:** P3 | **Scope:** M  
**Why:** Reduce eye strain for users in low-light environments  
**Acceptance Criteria:**
- [ ] Toggle button in header
- [ ] Dark color scheme applied to all components
- [ ] Preference saved to localStorage
- [ ] Smooth transition animations

**Files to Modify:** `index.html`, `script.js`, `styles.css`

---

### **ID 8** Add form validation feedback UI
**Status:** PENDING  
**Priority:** P2 | **Scope:** S  
**Why:** Current validation uses `alert()` which is intrusive  
**Acceptance Criteria:**
- [ ] Replace `alert()` calls with inline error messages
- [ ] Red border on invalid fields
- [ ] Error text below each field
- [ ] Clear errors on successful input

**Files to Modify:** `index.html`, `script.js`, `styles.css`

---

### **ID 9** Create data clearing/reset functionality
**Status:** PENDING  
**Priority:** P2 | **Scope:** S  
**Why:** Users need way to clear demo data or start fresh  
**Acceptance Criteria:**
- [ ] "Clear All Data" button in settings/export section
- [ ] Confirmation dialog with transaction count
- [ ] Option to export before clearing
- [ ] Reset to empty state (no demo data)

**Files to Modify:** `index.html`, `script.js`

---

### **ID 10** Add keyboard shortcuts for common actions
**Status:** PENDING  
**Priority:** P3 | **Scope:** M  
**Why:** Power users benefit from quick access; improves efficiency  
**Acceptance Criteria:**
- [ ] `Ctrl+N` / `Cmd+N`: Focus new transaction form
- [ ] `Ctrl+E` / `Cmd+E`: Export data
- [ ] `Esc`: Cancel edit mode
- [ ] `?`: Show keyboard shortcuts help modal

**Files to Modify:** `script.js`, `index.html`, `styles.css`

---

## Project Structure

```
/
├── index.html          # Main HTML structure
├── script.js           # Application logic (653 lines)
├── styles.css          # Styling (external CSS)
├── .gitignore          # Git exclusions
└── .github/
    └── copilot-instructions.md  # This file (TODO list)
```

## Completed Features
- ✅ CSS separation (styles.css extracted from inline)
- ✅ Transaction CRUD operations
- ✅ Edit transaction workflow
- ✅ CSV/JSON export
- ✅ CSV/JSON import with validation
- ✅ Chart.js integration for insights
- ✅ Budget tracking with visual progress bars
- ✅ Month-based filtering
- ✅ LocalStorage persistence

## Technical Notes
- **No build process** - Pure vanilla HTML/CSS/JS
- **No dependencies** - Except Chart.js via CDN
- **Browser target** - Modern evergreen browsers (ES6+)
- **Storage** - LocalStorage only (no backend)

---

## Contributing Guidelines
1. Work on ONE task at a time
2. Update this file's status as tasks progress
3. Test in browser before committing
4. Keep acceptance criteria as checklist
5. No scope creep - split large tasks if needed
