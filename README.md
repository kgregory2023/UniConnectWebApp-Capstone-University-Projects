## CIS4592: "UnIConnect"
Group 3's Capstone Project for Spring 2025
--Remember to add topics once discussing with group what type of app we are developing--

## Introduction
UnIConnect is a webapp to be used by students of universities in order to develop a more social life on campuses of their choice. The application allows a user to create an account, sign in, and either match with another student through card based swiping, similar to Tinder, and discover locations on and around campus with reviews and ratings from the student body, similar to Yelp.

## Installation
### For the front end
Ensuring that you are in the directory: UnIFront

With Node.JS and git bash terminal, ensure you have ran

`npm i`

and to run from the UnIFront directory
`npm run dev`

which will open the frontend on a localhost website with a port specified within the terminal. Vite defaults to 5173.

### For the back end
Ensuring that you are in the directory: UnIBack

With Node.JS and git bash terminal, ensure that these dependencies have been installed.

`npm i`

and then you can run from the UnIBack/src directory
`node server.js`




## Documentation
### Within the backend
The backend has a file structure that includes models, controllers, routes, and services that each serve a unique function. For each Schema in our database, we have a unique model, controller, route and service. Each one is defined here.

Model - Defines the objects to be held within the database

Services - Performs the business operations on incoming and outgoing database requests

Controller -

Routes - Defines routes that will be called to, primarily by the frontend, in order to carry out specific database and backend functions.



## Contributing
  - ### (How to run tests)
Ensuring that you are in the directory for UnIBack, there is a tests folder to cd into. Once in that directory, and ensuring that you have all the dependencies needed for the backend, running

`npm test` 

will run a series of Jest tests on the backend functionality.

  - ### (How To run the app)
Both the frontend and the backend must be running as described previously in installation. 

While in the UnIBack directory `node server.js` 

on a seperate terminal, whil in the UnIFront directory, `npm run dev`

These two commands will allow you to open http:localhost:5173, port 5173 is the port that vite defaults to, and if the port is in use, will find another open port to use.

## Get in Touch
  - (Github Issues)
  - (discord)

### Video
https://drive.google.com/file/d/1Uuvm0-8mchNEGIvj-00L9rnUPBlwSqaQ/view?usp=drive_link