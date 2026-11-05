# TP 1 — Premiers pas

> Écrivez la méthode qui salue la personne qu'on lui donne. Les tests sont déjà
> écrits : faites-les passer, un par un.

## Objectifs

- Lire un test JUnit qui échoue et le faire passer
- Travailler dans une boucle de tests avec Maven

## Mise en place

Un JDK 21 ou plus récent, et Maven.

```bash
mvn test
```

## Étapes

1. Dans `src/main/java/training/Greeter.java`, renvoyez `Bonjour, <prénom> !`.
2. Retirez les espaces autour du prénom.
3. Saluez tout le monde quand le prénom est vide.

## C'est fini quand

- `mvn test` passe, les trois tests de `GreeterTest` au vert
