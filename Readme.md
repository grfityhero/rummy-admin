This is a [vite.js](https://vitejs.dev/) project.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) with your browser to see the result.

You can start editing the page by modifying `pages/home.jsx`. The page auto-updates as you edit the file.


## Deploy on Netlify

****Install the Netlify CLI*****
 ==>> npm install -g netlify-cli (ONE TIME COMMAND)

****Create a new site in Netlify******
 ==>>  ntl init (ONE TIME COMMAND)

****Create a build******
==>> npm run build (EVERY TIME COMMAND)

****Change Folder Name******
==>> Change `dist` folder to `build` and delete old build folder (EVERY TIME)

****Deploy to a unique preview URL****
==>> ntl deploy (EVERY TIME COMMAND)

****Deploy the site into production***
==>> ntl deploy --prod (EVERY TIME COMMAND)


