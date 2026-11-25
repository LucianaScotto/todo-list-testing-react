import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from './TodoApp';

test('Permite al usuario agregar, completar y eliminar tareas', () => {
  render(<TodoApp />);
  const input = screen.getByRole('textbox');
  const addButton = screen.getByRole('button', { name: /agregar tarea/i });

  // 1. Agregar tarea
  fireEvent.change(input, { target: { value: 'Tarea importante' } });
  fireEvent.click(addButton);

  const task = screen.getByText(/tarea importante/i);
  expect(task).toBeInTheDocument();

  // 2. Completar tarea haciendo clic sobre ella
  fireEvent.click(task);
  expect(task).toHaveClass('completed');

  // 3. Eliminar tarea
  const deleteButton = screen.getByRole('button', { name: /eliminar tarea importante/i });
  fireEvent.click(deleteButton);
  expect(screen.queryByText(/tarea importante/i)).not.toBeInTheDocument();
});