# Headlines

![Team Photo](https://github.com/dartmouth-cs98/21f-headlines/blob/main/DocumentationImages/teamselfie.jpeg)

Headlines is a mobile app that is a trivia game about current events. Users can currently play in singleplayer mode. To learn about current events, users can also browse articles in the app.

<img width="352" alt="Screen Shot 2021-11-23 at 3 44 57 PM" src="https://user-images.githubusercontent.com/59703535/143134150-e02973d5-2016-468e-b8b3-9369141e0c82.png">

<img width="352" alt="Screen Shot 2021-11-23 at 3 31 05 PM" src="https://user-images.githubusercontent.com/59703535/143133667-e2259cae-4274-422e-801a-4e90bf71bd9a.png">

## Usage

### A Note on Dates
* Tl;dr: you must pass a date in ISO form from the frontend
* Mongo stores dates in UTC and Heroku servers are based in UTC 
* We would like the app to operate on Eastern time (that is, the challenge resets each day at midnight eastern)
* To stay consistent: 
  * Anytime you must get current date on frontend: use `luxon.DateTime.now().toISO()`, and pass that to the backend, because this ensures that the date being passed already has a timezone associated with it (that is, the backend won't auto-set it to UTC)
  * When posting a new daily challenge or user challenge: 
    * daily challenge is in Mongo in UTC, will store at UTC time of 6 each day
    * user challenges are also stored in UTC, just store with same date as daily challenge

### Daily Challenges

- `POST /dailyChallenges` where `req.body.challenge` is the daily challenge to be added
- `GET? /dailyChallenges/?date=date`: retrieve a daily challenge based on date

### User Challenges

- `POST /userChallenges`: add a user's performance on a daily challenge
  - `req.body.challenge` is the user challenge object to be added
- `GET /userChallenges`: gets the top ten performer's on the day
- `GET /userChallenges/:userID`: get a user's performance over the last 7 days
- `GET /userChallenges/friends/:userID`: get the performance of the friends of the user with `userID`

## Architecture

#### Overall descriptions of code organization and tools and libraries used

Diagram of our architecture:
![diagram](https://github.com/dartmouth-cs98/21f-headlines/blob/main/DocumentationImages/architecture.png)

3 repositories:

- Client/frontend
- API/game backend
- News scraping and question generation

We will also have a database to store the user information, questions, etc.

## Setup

If you haven't already, install Node 12 LTS (https://nodejs.org/en/download/).

Once you have done this, run the command `npm install --global expo-cli`.
You then start the development server with the command `npm start`.

#### Adding linting

Inside the directory, type the command `npm install eslint@7.32.0` in the terminal.

Next, you should install the ESLint extension available for VSCode: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint.

Rules can be added within `.eslintrc.js`, for instance, rules for consistent spacing and indentation.

Instead of having to manually run **ESLint: Fix all auto-fixable Problems**, you can set up VSCode to fix auto-fixable problems. Go to **File > Preferences > Settings** (or **Code > Preferences > Settings**). Click **Workspace** and search **Code Actions On Save**. Next, click `settings.json`. In `settings.json`, paste the following code:

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
 }
```

For more instructions: https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting.

## Deployment

Not deployed yet

## Authors

TODO: list of authors

## Acknowledgments
