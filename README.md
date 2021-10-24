# Headlines

![Team Photo](https://github.com/dartmouth-cs98/21f-headlines/blob/main/DocumentationImages/teamselfie.jpeg)

## Architecture

- Node.js / Express server
- Talks to Question Gen (for scraping news and generating questions) and talks to the database (which has game and user data).

## Setup

`npm install`

`npm start`

#### Automatic Linting

To set up automatic linting in VS Code, install the ESLint extension: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint. 

To install eslint, type `npm install eslint@7.32.0` in your terminal in the directory. If not already initialized, to initialize eslint, type `npx eslint --init`. This creates a `.eslintrc.js` file which allows you to define rules for use. 

You can also set up lint rules that run auto-fix every time you save a file. To do so, you must change your VS Code preferences. Go to **Code > Preferences > Settings**. Click **Workspace**, and search for **Code Actions on Save**. Then click `settings.json`. Within it, paste the following code:

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Deployment

TBD

## Authors

TODO: list of authors

## Acknowledgments
