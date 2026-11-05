import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';

test('greets whoever the visitor says they are', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada' } });
  fireEvent.click(screen.getByRole('button', { name: 'Greet me' }));

  expect(screen.getByText('Hello, Ada!')).toBeTruthy();
});
