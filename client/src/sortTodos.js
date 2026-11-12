// Sorting happens in the browser: a list's todos are already loaded and
// lists are small, so there's no need for a server round trip.
export const SORT_OPTIONS = [
    { value: 'createDate', label: 'Date created' },
    { value: 'dueDate', label: 'Due date' },
];

export function sortTodos(todos, sortBy) {
    const sorted = [...todos];

    if (sortBy === 'dueDate') {
        sorted.sort((a, b) => {
            // Todos without a due date go last;
            if (a.dueDate === b.dueDate) return a.id - b.id;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate < b.dueDate ? -1 : 1;
        });
    } else {
        sorted.sort(
            (a, b) => Date.parse(a.createDate) - Date.parse(b.createDate) || a.id - b.id
        );
    }

    return sorted;
}
