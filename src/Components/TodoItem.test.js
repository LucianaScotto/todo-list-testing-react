import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoItem from './TodoItem';

test('Muestra la tarea correctamente', () => {
  render(<TodoItem task="Aprender Jest" />);
  const taskElement = screen.getByText(/Aprender Jest/i);
  expect(taskElement).toBeInTheDocument();
});
