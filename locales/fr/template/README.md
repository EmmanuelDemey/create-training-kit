# {{title}}

Le support de la formation **{{title}}** : un deck de slides, des TP, et le site
qui les publie — construits par
[training-kit](https://www.npmjs.com/package/@emmanueldemey/training-kit).

```
slides/            un fichier Markdown par chapitre (Slidev)
workshops/         un dossier par TP : son README.md et le code de départ
solutions/         les corrigés, un dossier par TP, mêmes noms
training.config.mjs
```

## Écrire

```bash
npm install
npm run list       # ce que la numérotation prend en compte, et ce qu'elle laisse de côté
npm run dev        # le deck et le site, en direct — http://localhost:3030 et :4321
npm run slides     # le deck seul, avec les raccourcis clavier de Slidev
npm run site       # le site des TP seul
npm run check      # ce qui casserait, sans construire
npm run verify     # les tests de chaque corrigé
```

**Le numéro au début d'un nom est sa place.** `slides/3-routing.md` est le
chapitre 3, `workshops/3-routing/` le TP 3 ; `10-…` vient après `9-…`. Un nom qui
commence par `_` est désactivé — gardé sur le disque, laissé hors du deck, du
site, des PDF et des ZIP. Aucune liste à tenir à jour ailleurs.

Le dossier des slides est un projet Slidev classique : `components/`, `public/`,
`styles/`, `layouts/` à côté des chapitres fonctionnent comme Slidev le documente.

## Construire

```bash
npm run build          # tout, dans build/
npm run build:fast     # sans les exports PDF (la partie lente)
npx serve build        # le servir comme le fera l'hébergeur
```

```
build/
  index.html                 le site des TP — une page par TP
  slides/                    le deck
  downloads/
    {{slug}}-slides.pdf        le deck, exporté
    {{slug}}-workshops.pdf     les TP, en un livret imprimable
    {{slug}}-solutions.zip     les corrigés
    {{slug}}-participants.zip  les deux PDF + les dossiers des TP, sans corrigés
    tp/
      1-first-steps-starter.zip     un TP, prêt à travailler
      1-first-steps-solution.zip    son corrigé : solutions/1-first-steps/
```

Chaque page de TP renvoie vers ses deux ZIP, et la page Ressources les liste tous.
Un corrigé est associé à son TP par le nom du dossier : gardez-les identiques.

Les exports PDF s'impriment avec Chromium. Pour utiliser celui déjà installé sur
la machine plutôt que de télécharger celui de Playwright, mettez son chemin dans
`TRAINING_KIT_CHROME`.

## Déployer

`netlify.toml` est prêt : connectez le dépôt, rien d'autre à régler. Tout
hébergeur statique convient — publiez `build/`. `build/_redirects` (le repli SPA
du deck) et `build/_headers` (ce dont a besoin l'éditeur en ligne des pages de
TP) sont au format de Netlify ; traduisez-les pour un autre hébergeur.
