import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

test('greets whoever the visitor says they are', async () => {
  const app = mount(App);

  await app.get('input').setValue('Ada');
  await app.get('form').trigger('submit');

  expect(app.get('#greeting').text()).toBe('Hello, Ada!');
});
