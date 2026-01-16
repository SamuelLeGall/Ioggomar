# ioggomar

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Unit tests

```
npm run test
```

### Add a localization

in main.ts : choose a tag for the new localization ex: fr-FR, then add this line :

```
  fr-FR: localizationMessagesObject.fr-FR,
```

Add your chosen tag into src/config/mapping.json --> in game.localization
You then need to go to src/localizations/

Copy one of the folder, I recommend en-US or fr-FR and rename it as your tag name. Here the folder name is fr-FR.

Translate all json files in your folder. File look like this :

```
{
  "PageNotFound": {
    "title": "Page introuvable, Nous sommes désolés du désagrément.",
    "goBackMainMenu": "Retourner au menu principal"
  }
}
```

You should never have to change the left size, only the right size. In the above example,do NOT change PageNotFound, title and goBackMainMenu.

### Add a theme

Choose a tag.
Add your chosen tag into src/config/mapping.json --> in game.theme

You then need to go to src/styles/variables/data-themes.scss and add :

```
[data-theme="you_chosen_tag"] {
  // your custom scss here
  --primary-color: rgba(233, 128, 100, 1);
}
```

### Using alias for an added folder

You have to edit 3 files, all situated at the root of the project. One is used for the unit tests, one for vite/vue and the last only for typescript.
vitest.config.ts, vite.config.ts, tsconfig.json

### Link trello

https://trello.com/b/OQHjD7CB/ioggomar-planning
