// The one file training-kit reads. Everything here but `title` is optional:
// the comments give the defaults.
import { defineConfig } from '@emmanueldemey/training-kit';

export default defineConfig({
  title: {{title}},
  author: {{author}},

  // One Markdown file per chapter, in the order of the number its name starts
  // with: 1-introduction.md, 2-first-steps.md, … 10-… comes after 9. A name that
  // starts with _ is turned off. `npm run list` shows what is picked up.
  slides: 'slides',

  // One folder per workshop, numbered the same way, each with a README.md: the
  // instructions the learner reads in the folder, on the site and in the PDF.
  workshops: 'workshops',

  // The worked answers: one folder per workshop, with the SAME name as the
  // workshop folder (solutions/1-first-steps/ for workshops/1-first-steps/).
  // Each is zipped for download from its workshop page. `false` if there are none.
  solutions: 'solutions',

  // An editor running in the browser (StackBlitz) at the top of each workshop
  // page, loaded with the workshop folder: no clone, no install. `false` to
  // leave it out, or an object to tune it:
  //   { template: 'node', openFile: ['README.md', 'src/App.vue'], limits: 'What does not run online.' }
  playground: {{playground}},

  // For the "edit this page" and "browse the folder" links of the site:
  // repository: { url: 'https://github.com/me/my-training', branch: 'main', dir: '' },

  // Any Slidev headmatter: https://sli.dev/custom/#headmatter
  deck: {
    theme: 'default',
    headmatter: {},
  },

  // lang: 'en',
  // outDir: 'build',
});
