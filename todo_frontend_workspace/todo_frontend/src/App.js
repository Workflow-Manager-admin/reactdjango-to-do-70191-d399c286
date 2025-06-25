import React, { useEffect, useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main To-Do List App
 * Lets users add, view, and delete tasks via REST API.
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Change this to your backend API base URL.
  // For local development, use: http://localhost:8000/api/tasks/
  // For deployment, configure as needed.
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL ||
    'http://localhost:8000/api/tasks/';

  // PUBLIC_INTERFACE
  /** Fetch tasks on mount */
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  /** Fetch the list of tasks from backend */
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(BACKEND_URL);
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks.');
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  /** Add a new task via POST */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTask.trim() })
      });
      if (!response.ok) throw new Error('Failed to add task');
      setNewTask('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task.');
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  /** Delete a task via DELETE */
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(BACKEND_URL + id + '/', {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
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
              />
              <button className="btn" type="submit" disabled={loading || !newTask.trim()}>
                Add
              </button>
            </form>
            {error && <div className="error-msg">{error}</div>}
            {loading && <div className="loading-msg">Loading...</div>}
            <ul className="todo-list">
              {tasks.length === 0 && !loading && <li className="todo-empty">No tasks.</li>}
              {tasks.map((task) => (
                <li className="todo-item" key={task.id}>
                  <span className="todo-title">{task.title}</span>
                  <button className="btn btn-delete" title="Delete Task"
                    onClick={() => handleDelete(task.id)} disabled={loading}>
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
