const form = document.querySelector('#form');
const greeting = document.querySelector('#greeting');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  greeting.textContent = `Bonjour, ${form.elements.name.value} !`;
});
