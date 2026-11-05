# TP 1 — Premiers pas

> Écrivez la fonction qui salue la personne qu'on lui donne. Les tests sont déjà
> écrits : faites-les passer, un par un.

## Objectifs

- Lire un test qui échoue et le faire passer
- Travailler dans une boucle de tests

## Mise en place

```bash
npm run test:watch
```

Rien à installer : les tests tournent sur le lanceur de tests de Node.

## Étapes

1. Dans `src/greet.js`, renvoyez `Bonjour, <prénom> !`.
2. Retirez les espaces autour du prénom.
3. Saluez tout le monde quand le prénom est vide.

## C'est fini quand

- `npm test` passe, les trois tests au vert
