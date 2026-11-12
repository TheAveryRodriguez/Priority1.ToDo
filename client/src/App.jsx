import { useEffect, useState } from 'react';
import {
  getLists,
  createList,
  renameList,
  deleteList,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api';
import ListSidebar from './components/ListSidebar';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import { SORT_OPTIONS, sortTodos } from './sortTodos';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todosLoading, setTodosLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('createDate');

  useEffect(() => {
    getLists()
      .then((data) => {
        setLists(data);
        if (data.length > 0) setSelectedListId(data[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedListId === null) {
      setTodos([]);
      return;
    }

    let ignore = false;
    setTodosLoading(true);

    getTodos(selectedListId)
      .then((data) => {
        if (!ignore) setTodos(data);
      })
      .catch((e) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setTodosLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedListId]);

  async function handleCreateList(name) {
    try {
      const created = await createList({ name });
      setLists((prev) => [...prev, created]);
      setSelectedListId(created.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleRenameList(list, name) {
    try {
      const updated = await renameList(list.id, { name });
      setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDeleteList(list) {
    const confirmed = window.confirm(
      `Delete "${list.name}" and all of its todos? This can't be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteList(list.id);

      const index = lists.findIndex((l) => l.id === list.id);
      const remaining = lists.filter((l) => l.id !== list.id);
      setLists(remaining);

      if (list.id === selectedListId) {
        const next = remaining[Math.min(index, remaining.length - 1)];
        setSelectedListId(next ? next.id : null);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleAdd(title, dueDate = null) {
    try {
      const created = await createTodo(selectedListId, { title, dueDate });
      setTodos((prev) => [...prev, created]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        isComplete: !todo.isComplete,
        dueDate: todo.dueDate,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleEdit(todo, { title, dueDate }) {
    try {
      const updated = await updateTodo(todo.id, {
        title,
        isComplete: todo.isComplete,
        dueDate,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(todo) {
    try {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    } catch (e) {
      setError(e.message);
    }
  }

  const selectedList = lists.find((l) => l.id === selectedListId);
  const sortedTodos = sortTodos(todos, sortBy);

  return (
    <div className="app">
      <h1>Priority1 ToDo</h1>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="layout">
          <ListSidebar
            lists={lists}
            selectedListId={selectedListId}
            onSelect={(list) => setSelectedListId(list.id)}
            onCreate={handleCreateList}
            onRename={handleRenameList}
            onDelete={handleDeleteList}
          />

          <main className="list-panel">
            {selectedList ? (
              <>
                <div className="panel-header">
                  <h2>{selectedList.name}</h2>
                  <label className="sort-control">
                    Sort by
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <AddTodoForm onAdd={handleAdd} />
                {todosLoading ? (
                  <p className="muted">Loading…</p>
                ) : (
                  <TodoList
                    todos={sortedTodos}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </>
            ) : (
              <p className="muted">Create a list to get started.</p>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
