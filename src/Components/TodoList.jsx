import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ tasks, onToggleTask, onDeleteTask }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <TodoItem
          key={index}
          task={task}
          onToggle={onToggleTask ? () => onToggleTask(index) : undefined}
          onDelete={onDeleteTask ? () => onDeleteTask(index) : undefined}
        />
      ))}
    </ul>
  );
}