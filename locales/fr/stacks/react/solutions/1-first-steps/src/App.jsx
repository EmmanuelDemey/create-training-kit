import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [greeted, setGreeted] = useState('');

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setGreeted(name);
        }}
      >
        <label htmlFor="name">Votre prénom</label>
        <input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" />
        <button>Saluez-moi</button>
      </form>
      <p id="greeting">{greeted && `Bonjour, ${greeted} !`}</p>
    </>
  );
}
