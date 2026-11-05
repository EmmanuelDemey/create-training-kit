// Le seul fichier que lit training-kit. Tout y est facultatif sauf `title` :
// les commentaires donnent les valeurs par défaut.
import { defineConfig } from '@emmanueldemey/training-kit';

export default defineConfig({
  title: {{title}},
  author: {{author}},

  // La langue du deck, du site et du livret : leurs libellés, leur recherche.
  lang: 'fr',

  // Un fichier Markdown par chapitre, dans l'ordre du numéro qui commence son
  // nom : 1-introduction.md, 2-premiers-pas.md, … 10-… vient après 9. Un nom qui
  // commence par _ est désactivé. `npm run list` montre ce qui est pris en compte.
  slides: 'slides',

  // Un dossier par TP, numéroté de la même façon, chacun avec un README.md : les
  // consignes que lit l'apprenant, dans le dossier, sur le site et dans le PDF.
  workshops: 'workshops',

  // Les corrigés : un dossier par TP, avec le MÊME nom que le dossier du TP
  // (solutions/1-first-steps/ pour workshops/1-first-steps/).
  // Chacun est zippé, à télécharger depuis la page de son TP. `false` s'il n'y en a pas.
  solutions: 'solutions',

  // Un éditeur dans le navigateur (StackBlitz) en haut de chaque page de TP,
  // chargé avec le dossier du TP : ni clone, ni installation. `false` pour
  // s'en passer, ou un objet pour le régler :
  //   { template: 'node', openFile: ['README.md', 'src/App.vue'], limits: 'Ce qui ne tourne pas en ligne.' }
  playground: {{playground}},

  // Pour les liens « modifier cette page » et « parcourir le dossier » du site :
  // repository: { url: 'https://github.com/me/my-training', branch: 'main', dir: '' },

  // N'importe quel headmatter Slidev : https://sli.dev/custom/#headmatter
  deck: {
    theme: 'default',
    headmatter: {},
  },

  // outDir: 'build',
});
