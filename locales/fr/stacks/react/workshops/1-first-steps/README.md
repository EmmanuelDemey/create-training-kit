# TP 1 — Premiers pas

> Faites saluer par la page le visiteur, sous le nom qu'il donne. Un composant à
> modifier, un navigateur pour vérifier, et un test qui dit quand c'est fini.

## Objectifs

- Garder ce que tape le visiteur dans l'état d'un composant, avec `useState`
- Mettre la page à jour sans la recharger

## Mise en place

```bash
npm install
npm run dev
```

Ouvrez l'adresse affichée. `npm run test:watch` dans un second terminal relance
le test à chaque enregistrement.

## Étapes

1. Dans `src/App.jsx`, gardez ce qui est saisi dans le champ dans l'état du composant.
2. À l'envoi, empêchez la page de se recharger et gardez le prénom à saluer.
3. Affichez `Bonjour, <prénom> !` dans le paragraphe `#greeting`.

## C'est fini quand

- Saisir un prénom et appuyer sur <kbd>Entrée</kbd> affiche le message
- `npm test` passe
