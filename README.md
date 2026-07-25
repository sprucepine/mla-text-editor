# mla-text-editor

MLA Text Editor is a block-based text editor that makes it easier to maintain the MLA format. 

### How to run it locally

This project is a local Vite/Vue app, so you can run it directly on your machine.

- Required language version: Node.js 20.19+ (or any version compatible with the `package.json` engine range `^20.19.0 || >=22.12.0`).
- System dependencies: none beyond Node.js and npm.
- Environment variables: none required for local development.
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`

The app uses Vue.js for two-way binding and reactivity, along with standard Vue ecosystem libraries such as Pinia.

### GitHub Actions

This repo uses two actions that run on commits to dev and main.

Create Dependency Licenses - runs on dev and main

Creates a pull request with a list of dependency licenses at https://github.com/sprucepine/mla-text-editor/blob/main/THIRD_PARTY_LICENSES.md. This command will also remove any build-only dependencies from the project.

Push to GitHub Pages - runs only on main

Pushes the app to GitHub pages to be viewed everywhere (production environment).




<!-- This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
``` -->
