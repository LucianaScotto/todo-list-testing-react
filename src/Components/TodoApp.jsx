import React, { useState } from 'react';
import TodoList from './TodoList';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    setTasks([...tasks, { text: inputValue, completed: false }]);
    setInputValue('');
  };

  const handleToggleTask = (indexToToggle) => {
    setTasks(
      tasks.map((task, index) =>
        index === indexToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (indexToDelete) => {
    setTasks(tasks.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="Escribe una tarea..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAddTask}>Agregar Tarea</button>

      <TodoList
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}