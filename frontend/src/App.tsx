import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

const API_URL = 'http://localhost:5089/api/tasks';
const STORAGE_KEY = 'taskManager_tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    // Check if we should use localStorage
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
      setUseLocalStorage(true);
    } else {
      fetchTasks();
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (useLocalStorage && tasks.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, useLocalStorage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Task[]>(API_URL);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Using offline mode with localStorage.');
      setUseLocalStorage(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskDescription.trim()) {
      setError('Please enter a task description');
      return;
    }

    const newTask: Task = {
      id: Date.now(), // Simple ID generation for localStorage
      description: newTaskDescription,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    if (useLocalStorage) {
      // Add to localStorage
      setTasks([...tasks, newTask]);
      setNewTaskDescription('');
      setError('');
    } else {
      // Add via API
      try {
        const response = await axios.post<Task>(API_URL, {
          description: newTaskDescription
        });
        setTasks([...tasks, response.data]);
        setNewTaskDescription('');
        setError('');
      } catch (err) {
        setError('Failed to add task. Switching to offline mode.');
        setUseLocalStorage(true);
        setTasks([...tasks, newTask]);
        setNewTaskDescription('');
      }
    }
  };

  const toggleTask = async (task: Task) => {
    if (useLocalStorage) {
      // Update in localStorage
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      ));
    } else {
      // Update via API
      try {
        const response = await axios.put<Task>(`${API_URL}/${task.id}`, {
          description: task.description,
          isCompleted: !task.isCompleted
        });
        setTasks(tasks.map(t => t.id === task.id ? response.data : t));
      } catch (err) {
        setError('Failed to update task. Switching to offline mode.');
        setUseLocalStorage(true);
        setTasks(tasks.map(t => 
          t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
        ));
      }
    }
  };

  const deleteTask = async (id: number) => {
    if (useLocalStorage) {
      // Delete from localStorage
      setTasks(tasks.filter(t => t.id !== id));
    } else {
      // Delete via API
      try {
        await axios.delete(`${API_URL}/${id}`);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (err) {
        setError('Failed to delete task. Switching to offline mode.');
        setUseLocalStorage(true);
        setTasks(tasks.filter(t => t.id !== id));
      }
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTasks([]);
    setUseLocalStorage(false);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const activeCount = tasks.filter(t => !t.isCompleted).length;
  const completedCount = tasks.filter(t => t.isCompleted).length;

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Task Manager</h1>

        {useLocalStorage && (
          <div className="info-banner">
            💾 Using offline mode (localStorage)
            <button onClick={clearLocalStorage} className="btn-link">
              Switch to online mode
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="What needs to be done?"
            className="task-input"
          />
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </form>

        <div className="filter-buttons">
          <button
            className={`btn ${filter === 'all' ? 'btn-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`btn ${filter === 'active' ? 'btn-active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`btn ${filter === 'completed' ? 'btn-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="no-tasks">No tasks to show</p>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task)}
                    className="task-checkbox"
                  />
                  <span className="task-description">{task.description}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;