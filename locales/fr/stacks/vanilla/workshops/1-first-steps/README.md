# TP 1 — Premiers pas

> Faites saluer par la page le visiteur, sous le nom qu'il donne. Un fichier à
> modifier, et un navigateur pour vérifier.

## Objectifs

- Lire une valeur dans un formulaire
- Mettre la page à jour sans la recharger

## Mise en place

```bash
npm install
npm run dev
```

Ouvrez l'adresse affichée.

## Étapes

1. Dans `app.js`, écoutez l'événement `submit` du formulaire.
2. Empêchez l'envoi par défaut — la page ne doit pas se recharger.
3. Écrivez `Bonjour, <prénom> !` dans le paragraphe `#greeting`.

## C'est fini quand

- Saisir un prénom et appuyer sur <kbd>Entrée</kbd> affiche le message
- La page ne se recharge jamais
