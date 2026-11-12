// Due dates are calendar days ("2026-11-14"), not moments in time, so these
// helpers work with the user's *local* date and never go through UTC.

// Today's local date as "YYYY-MM-DD".
export function todayIso() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Overdue = not done, and the due date is before today. Due today is not
// overdue. "YYYY-MM-DD" strings sort the same as the dates they represent,
// so a plain string comparison is enough.
export function isOverdue(todo) {
    return Boolean(todo.dueDate) && !todo.isComplete && todo.dueDate < todayIso();
}

// "2026-11-14" -> "Nov 14, 2026" in the user's locale.
export function formatDueDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
