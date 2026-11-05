import { expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';

test('salue le visiteur sous le nom qu’il donne', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText('Votre prénom'), { target: { value: 'Ada' } });
  fireEvent.click(screen.getByRole('button', { name: 'Saluez-moi' }));

  expect(screen.getByText('Bonjour, Ada !')).toBeTruthy();
});
