---
name: createFeatureTodos
description: Generate structured TODO items for a new feature with priority and scope estimates
argument-hint: Feature name or description
---
Create a structured TODO list for the specified feature. Respect existing repository architecture and naming conventions.

**Context Gathering:**
- Scan open files and repository to infer missing steps
- Review existing patterns in the codebase
- Identify architectural constraints

**Task Creation Rules:**
1. Keep tasks atomic and independently executable
2. Target 6-12 tasks total (quality over quantity)
3. Split any task with scope > Medium into smaller subtasks
4. Use concrete action verbs (avoid vague terms like "improve", "handle")
5. Assign priority: P0 (critical), P1 (high), P2 (medium), P3 (low)
6. Estimate scope: S (small, <2 hours), M (medium, 2-8 hours), L (large, >8 hours)
7. Assign sequential ID numbers starting from the next available ID
8. Format as: "PX | S/M/L | ID X: Task Description"

**For each task, include:**
- **Status**: PENDING (default for new features)
- **Why**: Brief justification for the task
- **Acceptance Criteria**: Concrete outcomes including at least one quick functionality test to avoid bugs
- **Approach**: High-level implementation strategy (2-3 sentences)
- **Files**: List of files that will need modification
- **Dependencies**: Task IDs that must be completed first (if applicable)

**Example format:**
```
### **ID 11** - Add JWT token generation to auth module
**Status:** PENDING | **Priority:** P1 | **Scope:** M
**Why:** Users need secure token-based authentication for API access
**Acceptance Criteria:**
  - Generate JWT tokens on successful login
  - Tokens expire after 24 hours
  - Test: Login with valid credentials returns valid token
**Approach:** Create auth.js module with token generation, integrate crypto.subtle API for signing
**Files:** `modules/auth.js`, `modules/constants.js`, `script.js`
**Dependencies:** None
```

**After creating the list:**
1. Save to project TODOs and sync with .github/copilot-instructions.md
2. Sync with manage_todo_list using the format above
3. Propose ONE next best task (highest priority, ≤M scope, independent) + 2 alternates
4. STOP and wait for approval:
   • "Go" → execute locally in current workspace
   • "Go Background" → execute in isolated worktree
   • "Go Cloud" → execute via cloud coding agent + draft PR
