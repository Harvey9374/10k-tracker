# ISO 27001 Lead Implementer study app

React PWA. All content comes from `public/study-pack.json`.

Add questions, flashcards, controls or domains to the JSON and push. They appear without code changes.

Question format: `answer` is the zero-based index of the correct option. `domain` must match an `exam_domains` id.

Local development: `npm install`, then `npm run dev`.

Deployment: `.github/workflows/deploy-iso27001-study.yml` builds and publishes to GitHub Pages on push to `main`.
