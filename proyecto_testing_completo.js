/**
 * ============================================================================
   PROYECTO MÓDULO 5: TESTING COMPLETO DE UNA APLICACIÓN TODO LIST EN REACT
   Herramientas: Jest y React Testing Library
  ============================================================================
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/* ============================================================================
 * 1. CÓDIGO DE LOS COMPONENTES DE LA APLICACIÓN
 * ============================================================================ */

/**
 * Componente TodoItem:
 * Representa una tarea individual de la lista.
 * Permite mostrar el texto, marcarla como completada al hacer clic y eliminarla.
 */
export function TodoItem({ task, onToggle, onDelete }) {
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

/**
 * Componente TodoList:
 * Recibe el listado de tareas como prop y renderiza un TodoItem por cada una.
 */
export function TodoList({ tasks, onToggleTask, onDeleteTask }) {
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

/**
 * Componente TodoApp:
 * Componente principal que gestiona el estado de la lista de tareas
 * y contiene las funciones para agregar, completar y eliminar elementos.
 */
export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Agrega una nueva tarea si el campo no está vacío
  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    setTasks([...tasks, { text: inputValue, completed: false }]);
    setInputValue('');
  };

  // Alterna el estado completado/pendiente de una tarea según su índice
  const handleToggleTask = (indexToToggle) => {
    setTasks(
      tasks.map((task, index) =>
        index === indexToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Elimina una tarea de la lista según su índice
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

/* ============================================================================
 * 2. PRUEBAS AUTOMATIZADAS
 * ============================================================================ */

/**
 * A. PRUEBA UNITARIA (TodoItem)
 * Objetivo: Probar un componente de forma aislada.
 * Verifica que TodoItem reciba correctamente la prop "task" y la renderice en el DOM.
 */
test('Prueba Unitaria: Muestra la tarea correctamente', () => {
  render(<TodoItem task="Aprender Jest" />);
  const taskElement = screen.getByText(/Aprender Jest/i);
  expect(taskElement).toBeInTheDocument();
});

/**
 * B. PRUEBA DE SNAPSHOT (TodoList)
 * Objetivo: Capturar una fotografía de la estructura HTML generada por el componente
 * para detectar cambios visuales o estructurales no intencionados en el futuro.
 */
test('Prueba de Snapshot: Genera un snapshot del componente TodoList', () => {
  const tasks = ['Tarea 1', 'Tarea 2'];
  const { asFragment } = render(<TodoList tasks={tasks} />);
  expect(asFragment()).toMatchSnapshot();
});

/**
 * C. PRUEBA DE INTEGRACIÓN (TodoApp + TodoList + TodoItem)
 * Objetivo: Verificar la interacción entre múltiples componentes trabajando juntos.
 * Comprueba que al escribir en el input y hacer clic en el botón, la tarea se
 * agregue al estado de TodoApp y se renderice dentro de TodoList.
 */
test('Prueba de Integración: Permite agregar una tarea a la lista', () => {
  render(<TodoApp />);
  const input = screen.getByRole('textbox');
  const button = screen.getByRole('button', { name: /agregar tarea/i });

  fireEvent.change(input, { target: { value: 'Nueva tarea' } });
  fireEvent.click(button);

  const newTask = screen.getByText(/nueva tarea/i);
  expect(newTask).toBeInTheDocument();
});

/**
 * D. PRUEBA DE ACEPTACIÓN (Flujo completo de usuario)
 * Objetivo: Simular el recorrido real de un usuario final desde la interfaz.
 * Verifica el ciclo de vida completo: crear una tarea, marcarla como completada
 * (comprobando su clase CSS) y finalmente eliminarla de la lista.
 */
test('Prueba de Aceptación: Permite al usuario agregar, completar y eliminar tareas', () => {
  render(<TodoApp />);
  const input = screen.getByRole('textbox');
  const addButton = screen.getByRole('button', { name: /agregar tarea/i });

  // 1. El usuario escribe y agrega una tarea
  fireEvent.change(input, { target: { value: 'Tarea importante' } });
  fireEvent.click(addButton);

  const task = screen.getByText(/tarea importante/i);
  expect(task).toBeInTheDocument();

  // 2. El usuario hace clic en la tarea para marcarla como completada
  fireEvent.click(task);
  expect(task).toHaveClass('completed');

  // 3. El usuario hace clic en el botón eliminar y la tarea desaparece
  const deleteButton = screen.getByRole('button', { name: /eliminar tarea importante/i });
  fireEvent.click(deleteButton);
  expect(screen.queryByText(/tarea importante/i)).not.toBeInTheDocument();
});