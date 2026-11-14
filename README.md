# Portfolio

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CD6799?logo=sass&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-DE%20%7C%20EN-blue)

Personal portfolio website of Jens Baumann, Fullstack Developer.

## Tech Stack

- **Angular 21** (standalone components, signals, lazy-loaded routes)
- **TypeScript**
- **SCSS**
- **@ngx-translate** for German and English
- **@ng-icons** for icons
- **pdf.js** for the CV and certificate preview

## Development

Requires Node.js and npm.

```bash
npm install        # install dependencies
npm start          # start dev server (opens http://localhost:4200)
npm run build      # create a production build
```

## Structure

```
src/app
├── components   # reusable UI parts (hero, project rail, page hero, …)
├── constants    # project data, technology icons and site-wide values
├── pages        # routed pages (home, project detail, about, contact, …)
└── services     # language, SEO, scroll, motion and document services
src/styles
├── abstracts    # variables, functions, mixins
└── base         # fonts, reset, typography, global styles, buttons
```

## Features

- Responsive design
- Language switch DE/EN
- Project rail with detail pages for every project
- CV and certificates as in-browser PDF preview with download
- Contact form with spam protection

---

© Jens Baumann. All rights reserved.
