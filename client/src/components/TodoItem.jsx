import { useState } from 'react';
import { formatDueDate, isOverdue } from '../dates';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftDueDate, setDraftDueDate] = useState(todo.dueDate ?? '');

  function startEdit() {
    setDraftTitle(todo.title);
    setDraftDueDate(todo.dueDate ?? '');
    setEditing(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    const title = draftTitle.trim();
    const dueDate = draftDueDate || null;
    if (!title) return; // title is required; stay in edit mode

    if (title !== todo.title || dueDate !== todo.dueDate) {
      onEdit(todo, { title, dueDate });
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="todo-item">
        <form
          className="edit-form"
          onSubmit={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditing(false);
          }}
        >
          <input
            className="edit-title"
            value={draftTitle}
            autoFocus
            aria-label="Title"
            onChange={(e) => setDraftTitle(e.target.value)}
          />
          <input
            type="date"
            value={draftDueDate}
            aria-label="Due date"
            onChange={(e) => setDraftDueDate(e.target.value)}
          />
          <button type="submit" className="primary">
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  const overdue = isOverdue(todo);

  return (
    <li className={`todo-item ${overdue ? 'overdue' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => onToggle(todo)}
        title="Mark complete / incomplete"
      />

      <div className="todo-main">
        <span
          className={`title ${todo.isComplete ? 'complete' : ''}`}
          onDoubleClick={startEdit}
          title="Double-click to edit"
        >
          {todo.title}
        </span>
        {todo.dueDate && (
          <span className="due-date">
            Due {formatDueDate(todo.dueDate)}
            {overdue && <span className="badge-overdue">Overdue</span>}
          </span>
        )}
      </div>

      <button onClick={startEdit}>Edit</button>
      <button onClick={() => onDelete(todo)}>Delete</button>
    </li>
  );
}
