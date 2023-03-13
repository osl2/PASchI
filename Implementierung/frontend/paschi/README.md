# Installing and running PAschI frontend

## Project setup

### Requirements

- [Node.js](https://nodejs.org/en/) (v16.14.2)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) (v1.22.17)


### Install dependencies

```
# yarn
yarn install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev
# or
vite
```

### Compiles and minifies for production

```
# yarn
yarn build # (may not work)
# or
vite build
```

### Open in browser

Ope the browser and go to [http://localhost:3000](http://localhost:3000)

### Troubleshooting

- If you get errors that certain dependencies could not be found, make sure you have run yarn install before starting the dev server.
- Make sure there are no whitespace or special characters in the ***entire*** path to the project folder. This is a known issue with certain dependencies.
- Make sure you are running the latest version of Node.js and Yarn.
- If you are using Windows, do not use Windows PowerShell. Use the Command Prompt instead.

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
