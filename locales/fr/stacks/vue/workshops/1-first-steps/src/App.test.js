import { expect, test } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

test('salue le visiteur sous le nom qu’il donne', async () => {
  const app = mount(App);

  await app.get('input').setValue('Ada');
  await app.get('form').trigger('submit');

  expect(app.get('#greeting').text()).toBe('Bonjour, Ada !');
});
