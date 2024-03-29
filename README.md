
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

### Questions
- `GET /adminQuestions/?num=&?approved_status=&in_daily_quiz=`: get questions for admin mode (num is number of question, in_daily_quiz is optional, should only take `null`)
- `PUT /questions/:id`: update a question where id is the question id and `req.body.question` contains fields and values to update
  - Example `req.body = {
	            "question": {"approved_status": "approved"}
            }`

### Daily Challenges

- `POST /dailyChallenges` where `req.body.challenge` is the daily challenge to be added
- `GET /dailyChallenges/?date=date`: retrieve a daily challenge based on date
- `PUT /dailyChallenges/:id/questions?qId=question_id`: add a question to a daily challenge

### User Challenges

- `POST /userChallenges`: add a user's performance on a daily challenge
  - `req.body.challenge` is the user challenge object to be added
- `GET /userChallenges`: gets the top ten performer's on the day
- `GET /userChallenges/:userID`: get a user's performance over the last 7 days
- `GET /userChallenges/friends/:userID`: get the performance of the friends of the user with `userID`

### Users
- `POST /users/`: This end point creates a new user in the mongo database
- `GET /users/?term="jimmy"`: This endpoint takes a query term and teruns the users in the database that match that query term (the query "jimmy is put here as an example)
- `GET /users/:userID/?isFirebase='false'`, This endpoint takes in a user ID and gets the user of that id. Takes in a query term to determine whether or not we are searching for a user with their mongoID, or firebaseID
- `PUT /users/:userID` Takes in a mongoID as parameter and updates the user with the body of the post. 

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

This backend is deployed via Heroku with automatic deployment from this repository

