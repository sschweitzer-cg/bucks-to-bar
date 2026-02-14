# Bucks2Bar - Income & Expense Tracker

A clean, modern client-side application for tracking personal finances with visual insights and budget management.

## ✨ Features

- 📊 **Transaction Management**: Add, edit, and delete income/expense transactions
- 📈 **Visual Insights**: Charts showing monthly trends and category breakdowns
- 💰 **Budget Tracking**: Monitor spending against category budgets with progress bars
- 🔍 **Search & Filter**: Find transactions by description or month
- 💾 **Data Export/Import**: Backup and restore data via CSV or JSON
- 🎨 **Modern UI**: Gradient cards, smooth animations, responsive design
- 💻 **100% Client-Side**: No backend required, works entirely in the browser

## 🏗️ Architecture

Bucks2Bar uses a **modular ES6 architecture** for maintainability and scalability:

```
modules/
├── constants.js      - Configuration and constants
├── state.js          - State management
├── storage.js        - LocalStorage operations
├── transactions.js   - Business logic
├── ui.js            - UI rendering
├── charts.js        - Data visualization
└── import-export.js - Data import/export
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or installation required!

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/sschweitzer-cg/bucks-to-bar.git
cd bucks-to-bar/bucks-to-bar
```

2. Start a local web server:
```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

3. Open http://localhost:8080 in your browser

### Using the App

1. **Data Tab**: Add and manage transactions
2. **Insights Tab**: View charts, totals, and budget tracking
3. **Export**: Backup your data as CSV or JSON
4. **Import**: Restore data from exported files

## 📊 Demo Data

First-time users get pre-loaded demo data for 2026 (8 sample transactions). Start using the app immediately to see how it works!

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup |
| **CSS3** | Styling with gradients, flexbox, grid |
| **JavaScript ES6+** | Modular application logic |
| **Chart.js** | Data visualization (via CDN) |
| **LocalStorage API** | Client-side persistence (~5MB) |

**No frameworks, no build process** - just modern vanilla JavaScript!

## 📦 Storage

- Data stored in browser's LocalStorage (~5MB typical quota)
- Warning banner appears at 80% quota usage
- Export data regularly as backup
- Clear browser data = data loss (use export!)

## 🎯 Roadmap

See [.github/copilot-instructions.md](.github/copilot-instructions.md) for the complete TODO list.

### Upcoming Features
- [ ] Customizable budgets UI
- [ ] Dark mode toggle
- [ ] Mobile responsive improvements
- [ ] Recurring transactions
- [ ] Keyboard shortcuts
- [ ] Better form validation UI

## 🏛️ Architectural Improvements Implemented

### Before: Monolithic Design
- ❌ Single 893-line script.js
- ❌ All code in one file
- ❌ Hard to test, maintain, extend
- ❌ Tight coupling between modules
- ❌ No clear separation of concerns

### After: Modular Architecture
- ✅ 8 focused modules (avg 150 lines each)
- ✅ Clear separation of concerns
- ✅ Easy to test each module independently
- ✅ Dependency injection for flexibility
- ✅ Easy to extend with new features
- ✅ Self-documenting code structure
- ✅ Supports future framework migration

### Key Benefits

1. **Maintainability**: Find and fix issues faster
2. **Testability**: Unit test each module
3. **Scalability**: Add features without breaking existing code
4. **Developer Experience**: Clear module boundaries, easy onboarding
5. **Performance**: ES6 modules support tree-shaking and caching

## 📚 Additional Recommendations

### 1. **Add Unit Tests**
```bash
# Suggested testing stack
npm install --save-dev vitest
npm install --save-dev @testing-library/dom
```

Create `tests/` directory:
- `state.test.js` - Test state management
- `transactions.test.js` - Test business logic
- `storage.test.js` - Test localStorage (with mocks)
- `ui.test.js` - Test rendering logic

### 2. **Type Safety with JSDoc or TypeScript**

**Option A: JSDoc** (No build step)
```javascript
/**
 * @param {string} id - Transaction ID
 * @returns {Transaction|null}
 */
function getTransaction(id) { ... }
```

**Option B: TypeScript** (Better DX)
- Add `tsconfig.json`
- Convert `.js` → `.ts` gradually
- Get compile-time type checking

### 3. **Linting and Formatting**
```bash
npm install --save-dev eslint prettier
```

Add `.eslintrc.json`:
```json
{
  "extends": "eslint:recommended",
  "env": { "browser": true, "es2021": true },
  "parserOptions": { "sourceType": "module" }
}
```

### 4. **Replace Inline Event Handlers**

**Current** (in HTML):
```html
<button onclick="deleteTransaction('id')">Delete</button>
```

**Better** (in script.js):
```javascript
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-action="delete"]')) {
    const id = e.target.dataset.transactionId;
    deleteTransaction(id);
  }
});
```

### 5. **Error Handling Module**

Create `modules/errors.js`:
```javascript
export function showError(message) {
  // Better than alert() - show inline error banner
}

export function handleApiError(error) {
  // Centralized error handling
}
```

### 6. **Build Process (Optional)**

For production deployment:
```bash
npm install --save-dev vite
```

Benefits:
- Minification and bundling
- Dead code elimination
- Environment variables
- Development server with HMR

### 7. **Accessibility Improvements**
- Add ARIA labels to interactive elements
- Keyboard navigation support
- Focus management for modals
- Screen reader announcements for dynamic content

### 8. **Performance Optimizations**
- Debounce search input (avoid rendering on every keystroke)
- Virtual scrolling for large transaction lists
- Web Workers for CSV parsing
- Service Worker for offline support

### 9. **Security Enhancements**
- CSP (Content Security Policy) headers
- Sanitize user input (XSS prevention)
- Validate imported data more strictly

### 10. **CI/CD Pipeline**

Add `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
      - run: npm run lint
```

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using vanilla JavaScript**
