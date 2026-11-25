import React from 'react';

export default function TodoItem({ task, onToggle, onDelete }) {
  const taskText = typeof task === 'string' ? task : task.text;
  const isCompleted = typeof task === 'object' ? task.completed : false;

  return (
    <li>
      <span
        onClick={onToggle}
        className={isCompleted ? 'completed' : ''}
        style={{
          textDecoration: isCompleted ? 'line-through' : 'none',
          cursor: 'pointer',
        }}
      >
        {taskText}
      </span>
      {onDelete && (
        <button onClick={onDelete} aria-label={`Eliminar ${taskText}`}>
          Eliminar
        </button>
      )}
    </li>
  );
}