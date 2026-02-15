---
name: reconcileTodos
description: Sync TODO lists, propose prioritized task with alternates, await execution approval
argument-hint: Optional - specific TODO ID, priority filter, or task criteria
---
Reconcile TODOs with recent changes (minimal updates only). Respect existing repository architecture and naming conventions.

**Context Gathering:**
- Read all project TODO sources (AGENTS.md, .github/copilot-instructions.md, etc.)
- Review recent git changes/diffs to identify completed work
- Check for tasks marked in-progress but not updated

**Reconciliation Rules:**
1. Keep tasks atomic and independently executable
2. Use concrete action verbs (avoid vague terms like "improve", "handle")
3. Ensure each task has acceptance criteria with at least one functionality test
4. Verify priority: P0 (critical), P1 (high), P2 (medium), P3 (low)
5. Verify scope: S (small, <2 hours), M (medium, 2-8 hours), L (large, >8 hours)
6. Format as: "PX | S/M/L | ID X: Task Description"

**Sync with manage_todo_list:**
- Update status based on recent changes (PENDING → in-progress → completed)
- Split tasks with scope > Medium if needed
- Groom incomplete or ambiguous tasks for clarity

**Task Status Assessment:**

**If a task is in progress:**
- Recap completed work vs. acceptance criteria
- Split only if needed to isolate smallest independent subtask
- Propose continuation plan

**If no task is in progress:**
- Propose ONE next best task (highest priority, ≤M scope, independent) + 2 alternates
- Include brief rationale for each (why this one first)

**STOP and wait for approval:**
• "Go" → execute locally in current workspace
• "Go Background" → execute in isolated worktree
• "Go Cloud" → execute via cloud coding agent + draft PR

**After approval:**
1. Show 3–6 line micro plan with concrete outcomes
2. Implement exactly one task
3. Run tests/lint to verify no regressions
4. Summarize changes with file links
5. Update all TODO sources (.github/copilot-instructions.md, AGENTS.md)
6. Commit and push changes if git is configured

**If blocked:** Stop and ask 1–3 targeted questions
