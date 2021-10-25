# Headlines

![Team Photo](https://github.com/dartmouth-cs98/21f-headlines/blob/main/DocumentationImages/teamselfie.jpeg)

## Architecture

- Node.js / Express server
- Talks to Question Gen (for scraping news and generating questions) and talks to the database (which has game and user data).

## Structure 

- `router.js`: creates endpoints 
- `server.js`: sets up express boiler plate
- `controllers/`: contains controllers for different entities
- `models/`: contains data models for different entities

## Setup

`npm install`

`npm start`

## Deployment

Continuous deployment via Heroku: `https://cs98-headlines.herokuapp.com`

## Authors

TODO: list of authors

## Acknowledgments
