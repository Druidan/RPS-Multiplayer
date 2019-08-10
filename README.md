# RPS-Multiplayer
An online two-player Rock Paper Scissors game.

## Overview and Goals
This app will present a user with a simple login screen. Once logged in, the user will be paired with a random stranger who has also logged in, and then both players will be able to compete in as many games of rock, paper, scissors as they wish. This is meant to be an example of a static page using jQuery and Firebase in conjunction to create a dynamic multiplayer game.

## Deployment
The game is currently deployed in an incomplete form on GitHub Pages [HERE](https://druidan.github.io/RPS-Multiplayer/).

## MVP
* As the app is run, it must be able to do the following:
  * When a user goes to the webpage they must be prompted to enter a username. The username must be unique. 
  * Once they have entered a name, they must be notified that they are all set to play, and if they have a ready opponent, or if they are waiting on an opponent to join them.
  * They must be able to play against one (and ONLY one) other human player.
  * The game mechanics must prompt them as appropriate for playing a game of "Rock, Paper, Scissors," from their selection process, through comparing the two player's choices, to declaring a winner.
  * Their choices must not be available to their opponent at any point before both are chosen, and when the winner is declared, they must each recieve notification specific to them and their loss/win.
  * The players must be able to replay the game, while keeping their overall scores, and displying them after each win or loss.
  * There can be as many two player games running as there are pairs of players who have visited the site.
  * If one player disconnects, the other player must be able to reconnect with a new player as that player visits the page.
  * Both players must be able to communicate together through a simple chat window.

## Dependancies
* The goal of this app is to demonstrate a static page using a real time database. To that end, this app will only have [Firebase](https://firebase.google.com/) as a dependancy through CDN. 
* This project will also use jQuery.

## Bugs to Fix
* Sometimes a player will be awarded two wins for a single win.
* I am currently still getting a type error where the app reads a room snapshot as null. I'm not sure when it is happeneing as it doesn't seem to interfere with the game mechanics.

## Future Features:
* Choosing rock, paper, or scissors, will be on a timer. 
* RPS-Multiplayer 2 - A sequel built as a MERN app with more advanced features, like a true authentication system, persistent user data and records, and a React view engine. This is a seperate project from this one, and does not figure into the plan to refactor this project for its original specifications. 

## Refactoring (Currently Ongoing)
This project is currently under active refactoring with the following goals:
* Maintain the original goals of the project, that being a static page using a firebase real-time database to allow users to play a simple game of rock, paper, and scissors against one another with a chat window. 
* Modularize and simplify the code.
* Bring any vanilla js code up to ES6 standards.
* Construct a working chat window.
* Add appropriate CSS and convert to CSS Grid
* Polish the game mechanics.
* Make sure the transition from one game to the next is smooth and clear.
* Add timers to the selection screen.
* Add sounds.