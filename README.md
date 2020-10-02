# jwgly-tool-hanlin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development (for debug)
```
npm run serve
```

### Upload to gh-pages (for deployment)
```
update version in package.json

npm run build
git add .
git commit -m 'build for gh-pages'
git subtree push --prefix dist origin gh-pages

add tag
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
