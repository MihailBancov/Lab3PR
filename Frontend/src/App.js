import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_URL = 'http://localhost:5000/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      showNotification('Failed to load tasks', 'error');
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { 
          id: editingId, 
          title, 
          description,
          isCompleted: false
        });
        showNotification('Task updated successfully');
      } else {
        await axios.post(API_URL, { title, description, isCompleted: false });
        showNotification('Task added successfully');
      }
      setTitle('');
      setDescription('');
      setEditingId(null);
      await fetchTasks();
    } catch (error) {
      showNotification('Failed to save task', 'error');
      console.error('Error saving task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      showNotification('Task deleted successfully');
      await fetchTasks();
    } catch (error) {
      showNotification('Failed to delete task', 'error');
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/${task.id}`, { 
        ...task, 
        isCompleted: !task.isCompleted 
      });
      showNotification('Task updated successfully');
      await fetchTasks();
    } catch (error) {
      showNotification('Failed to update task', 'error');
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="app-header">
        <h1>✨ ToDo List</h1>
        <p>Organize your work and life</p>
      </header>

      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="form-input"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="form-input"
          />
          <button 
            type="submit" 
            className={`form-button ${editingId ? 'update-button' : 'add-button'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : editingId ? (
              'Update Task'
            ) : (
              'Add Task'
            )}
          </button>
        </form>
      </div>

      {isLoading && !tasks.length ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No tasks" />
              <p>No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`task-item ${task.isCompleted ? 'completed' : ''}`}
                >
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => toggleComplete(task)}
                      className="task-checkbox"
                    />
                    <div className="task-text">
                      <h3 className="task-title">{task.title}</h3>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <div className="task-meta">
                        <span className="task-date">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button 
                      onClick={() => {
                        setEditingId(task.id);
                        setTitle(task.title);
                        setDescription(task.description);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;