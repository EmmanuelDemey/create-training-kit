/** Le message de bienvenue pour `name`. */
export function greet(name) {
  return `Bonjour, ${name.trim() || 'tout le monde'} !`;
}
