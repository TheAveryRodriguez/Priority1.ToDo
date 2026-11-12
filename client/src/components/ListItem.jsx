import { useState } from 'react';

export default function ListItem({ list, selected, onSelect, onRename, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(list.name);

    function saveEdit() {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== list.name) {
            onRename(list, trimmed);
        } else {
            setDraft(list.name);
        }
        setEditing(false);
    }

    function cancelEdit() {
        setDraft(list.name);
        setEditing(false);
    }

    return (
        <li className={`list-item ${selected ? 'selected' : ''}`}>
            {editing ? (
                <input
                    className="edit-title"
                    value={draft}
                    maxLength={100}
                    autoFocus
                    aria-label="List name"
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                    }}
                />
            ) : (
                <>
                    <button
                        type="button"
                        className="list-name"
                        onClick={() => onSelect(list)}
                        onDoubleClick={() => setEditing(true)}
                        aria-current={selected ? 'true' : undefined}
                        title="Double-click to rename"
                    >
                        {list.name}
                    </button>
                    <button
                        type="button"
                        className="icon"
                        onClick={() => setEditing(true)}
                        aria-label={`Rename ${list.name}`}
                        title="Rename"
                    >
                        ✎
                    </button>
                </>
            )}
            <button
                type="button"
                className="icon"
                onClick={() => onDelete(list)}
                aria-label={`Delete ${list.name}`}
                title="Delete"
            >
                ✕
            </button>
        </li>
    );
}
