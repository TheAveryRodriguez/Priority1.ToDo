import { useState } from 'react';
import ListItem from './ListItem';

export default function ListSidebar({
    lists,
    selectedListId,
    onSelect,
    onCreate,
    onRename,
    onDelete,
}) {
    const [name, setName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        onCreate(trimmed);
        setName('');
    }

    return (
        <aside className="sidebar">
            <h2>Lists</h2>

            {lists.length > 0 && (
                <ul className="list-nav">
                    {lists.map((list) => (
                        <ListItem
                            key={list.id}
                            list={list}
                            selected={list.id === selectedListId}
                            onSelect={onSelect}
                            onRename={onRename}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}

            <form className="add-list-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="New list"
                    value={name}
                    maxLength={100}
                    aria-label="New list name"
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit" className="primary">
                    Add
                </button>
            </form>
        </aside>
    );
}
