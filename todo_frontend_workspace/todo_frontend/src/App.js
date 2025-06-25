import React, { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main To-Do List App
 * Lets users add, view, and delete tasks via REST API.
 */
function App() {
  // Task state array, string for new task field, and per-action/loading/error state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);               // general loading (fetch/add/del)
  const [actionError, setActionError] = useState('');          // for add/delete errors
  const [fetchError, setFetchError] = useState('');            // for initial fetch errors
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]); // for disabling delete btns during deletion
  const isMounted = useRef(true); // for preventing setState after unmount

  // Change this to your backend API base URL.
  // For local development, use: http://localhost:8000/api/tasks/
  // For deployment, configure as needed.
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL ||
    'http://localhost:8000/api/tasks/';

  // PUBLIC_INTERFACE
  /** Ensure no state updates if unmounted */
  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false } }, []);

  // PUBLIC_INTERFACE
  /** Fetch tasks on mount or refresh-trigger */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await fetch(BACKEND_URL);
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      if (isMounted.current) setTasks(data);
    } catch (err) {
      if (isMounted.current) setFetchError('Failed to load tasks.');
    }
    setLoading(false);
  }, [BACKEND_URL]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // PUBLIC_INTERFACE
  /** Add a new task with optimistic update and error rollback */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setActionError('');
    const optimisticTask = {
      id: Math.random().toString(36).substr(2, 9) + "_optimistic",
      title: newTask.trim(),
      optimistic: true
    };
    setTasks((prev) => [optimisticTask, ...prev]);
    setNewTask('');
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: optimisticTask.title })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const task = await response.json();
      // Replace optimistic task with real task from backend
      if (isMounted.current) {
        setTasks((prev) =>
          prev.map((t) => (t.id === optimisticTask.id ? task : t))
        );
      }
    } catch (err) {
      // Remove optimistic task, show err
      if (isMounted.current) {
        setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
        setActionError('Failed to add task.');
      }
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  /** Delete a task via DELETE; optimistic removal with rollback on error */
  const handleDelete = async (id) => {
    setActionError('');
    setPendingDeleteIds((ids) => [...ids, id]);
    // Optimistically remove
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL + id + '/', {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
    } catch (err) {
      // Rollback
      if (isMounted.current && taskToDelete) {
        setTasks((prev) => [taskToDelete, ...prev]);
        setActionError('Failed to delete task.');
      }
    }
    setPendingDeleteIds((ids) => ids.filter((did) => did !== id));
    setLoading(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> To-Do App
            </div>
            <span />
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <div className="todo-main">
            <h2 className="subtitle">To-Do List</h2>
            <form className="todo-form" onSubmit={handleAddTask}>
              <input
                className="todo-input"
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button className="btn" type="submit" disabled={loading || !newTask.trim()}>
                Add
              </button>
            </form>
            {fetchError && (
              <div className="error-msg">
                {fetchError + " "}
                <button className="btn btn-link" style={{ marginLeft: 4 }} onClick={fetchTasks} disabled={loading}>Retry</button>
              </div>
            )}
            {actionError && <div className="error-msg">{actionError}</div>}
            {loading && <div className="loading-msg">Working...</div>}
            <ul className="todo-list">
              {tasks.length === 0 && !loading && <li className="todo-empty">No tasks.</li>}
              {tasks.map((task) => (
                <li className="todo-item" key={task.id}>
                  <span className="todo-title" style={{
                    opacity: task.optimistic ? 0.5 : 1
                  }}>{task.title}</span>
                  <button className="btn btn-delete" title="Delete Task"
                    onClick={() => handleDelete(task.id)}
                    disabled={loading || pendingDeleteIds.includes(task.id) || task.optimistic}>
                    &#x1F5D1;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

// PUBLIC_INTERFACE
/**
 * USAGE NOTES:
 * - This To-Do app fetches, adds, and deletes tasks with optimistic UI updates and error handling.
 * - Backend endpoints (customizable via REACT_APP_BACKEND_URL):
 *   [GET]    /api/tasks/           => List all tasks (array)
 *   [POST]   /api/tasks/           => Add a new task (body: {title: string})
 *   [DELETE] /api/tasks/<id>/      => Delete by id (no body)
 *
 * Optimistic updates update UI instantly for add/delete; in case of failure,
 * the UI rolls back and shows an error message. Retry is available for failed fetch.
 */
