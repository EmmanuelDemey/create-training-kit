const form = document.querySelector('#form');
const greeting = document.querySelector('#greeting');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  greeting.textContent = `Hello, ${form.elements.name.value}!`;
});
