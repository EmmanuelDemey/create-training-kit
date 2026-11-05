// TODO — étape 1 : garder ce qui est saisi dans le champ dans un état `name`.
// TODO — étape 2 : à l'envoi, sans recharger la page, garder le prénom à saluer.
// TODO — étape 3 : afficher `Bonjour, <prénom> !` dans #greeting.
export default function App() {
  return (
    <>
      <form>
        <label htmlFor="name">Votre prénom</label>
        <input id="name" autoComplete="given-name" />
        <button>Saluez-moi</button>
      </form>
      <p id="greeting"></p>
    </>
  );
}
