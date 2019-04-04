# RPS-Multiplayer
This is the Unit 7 Homework Project, an online multiplayer Rock Paper Scissors game using Firebase.

## Goals and MVP:
* The goal of this project is to make an online multiplayer version of "Rock, Paper, Scissors," where two people can compete against one another.
* The MVP of this project is...:
  * When a user goes to the webpage they must be prompted to enter a username, and once they have done so, they must be all set to play, and be able to recognize that state of the game easily.
  * They must be able to play against one (and ONLY one) other human player.
  * The game mechanics must prompt them as appropriate for playing a game of "Rock, Paper, Scissors," from their selection process, through comparing the two player's choices, to declaring a winner.
  * Their choices must not be available to their opponent at any point before both are chosen, and when the winner is declared, they must each recieve notification specific to them and their loss/win.
  * The players must be able to replay the game, while keeping their overall scores, and displying them after each win or loss.
  * There can be as many two player games running as there are pairs of players who have visited the site.
  * If one player disconnects, the other player must be able to reconnect with a new player as that player visits the page.
  * Both players must be able to communicate together through a simple chat window.

## Future Features:
* Choosing rock, paper, or scissors, will be on a timer. 

## PseudoCode:
<!-- Any check-box code commented out is code I think I might need but don't know for sure yet! -->

- [X] When a user first visits the webpage: 
  - [X] The document loads.
  - [X] The JS initializes Firebase.
  - [ ] Firebase Directory Variables are established:
    - [X] A variable that refers directly to the database.
    - [X] A variable that refers to the All Game Rooms directory.
    - [X] A variable that refers to the All Players directory.
    - [X] A variable that will hold this user's directory.
    - [X] A variable that will hold this user's game room directory (which combines the directory string with the local variable created below that holds the room id.).
    <!-- - [ ] A variable that will hold this user's opponent's directory. -->
    - [X] A variable that refers directly to the connected reference.

  - [ ] Firebase Listeners are Established:
    - [X] Establish a Listener to see that the user is connected to Firebase.
    - [X] Establish a Listener for when this user's game room's "roomFull" key changes value.
    
  - [ ] The user is presented with a sign-in pop-up that includes an input field and a submit button. Nothing else can be interacted with until sign-in is completed. When the Submit Button is clicked...:

    - [X] We check the All Players database reference to see if any other player already has that username.
      - [ ] If another player already has that username, we notify the user and prompt them to select a new username.
      - [X] If no other player has that username, a local variable meant to hold this player's name is updated with this player's submitted name. 

      - [ ] We check to see if there are game rooms in the game rooms directory of Firebase.
        - [ ] If there are game rooms, We check to see if an existing room is missing a player 1.

      - [ ] If a room is missing a player 1... 
        - [ ] A local variable that represents this player's game room id is updated to the room's id that is missing a player 1.
        - [ ] A local variable that represents their player number is set to 1.
        <!-- The following Seems universal to all player creation once variables are set. Probably a seperate function.-->
        - [ ] Their standard player information/profile is created.
          - [ ] This profile is pushed to Firebase All Players directory.
          - [ ] The push key is captured as this player's ID, and updates a local variable with this information.
          - [ ] The profile is updated with the player's ID, their player number, their player name, and their game room number.
        - [ ] We check this player's game room to see if there is a player 2.
          - [ ] If there is a player 2, set this game room's key "roomFull" to true.
          <!-- - [ ] If there is no player 2, set this game room's "roomFull" key to false. -->

      - [ ] If there is no room missing a player 1, we check to see if there is a game room missing a player 2.

      - [ ] If a room is missing a player 2...
        - [ ] A local variable that represents this player's game room id is updated to the room's id that is missing a player 2.
        - [ ] A local variable that represents their player number is set to 2.
        <!-- The following Seems universal to all player creation once variables are set. Probably a seperate function. -->
        - [ ] Their standard player information/profile is created.
          - [ ] This profile is pushed to Firebase All Players directory.
          - [ ] The push key is captured as this player's ID, and updates a local variable with this information.
          - [ ] The profile is updated with the player's ID, their player number, their player name, and their game room number.
        - [ ] We check this player's game room to see if there is a player 1. <!--We do this redundant check in case Player 1 disconnected since player 2 joined.-->
          - [ ] If there is a player 1, set this game room's "roomFull" key to true.
          <!-- - [ ] If there is no player 1, set this game room's "roomFull" key to false. -->

      - [ ] If all game rooms are full...
        - [ ] A new Game Room with all nessesary game data is created:
          - [ ] This game room is pushed to Firebase All Game Rooms directory.
          - [ ] The push key is captured as this room's game room ID, and updates a local variable with this information.
        - [ ] A local variable that represents their player number is set to 1.
        <!-- The following Seems universal to all player creation once variables are set. Probably a seperate function. -->
        - [ ] Their standard player information/profile is created.
          - [ ] This profile is pushed to Firebase All Players directory.
          - [ ] The push key is captured as this player's ID, and updates a local variable with this information.
          - [ ] The profile is updated with the player's ID, their player number, their player name, and their game room number.
        - [ ] We check this player's game room to see if there is a player 2.
        <!--We do this redundant check in case a Player 2 connected since player 1 joined the room.-->
          - [ ] If there is a player 2, set this game room's key "roomFull" to true.
          <!-- - [ ] If there is no player 2, set this game room's "roomFull" key to false. -->


  - [ ] 2. If a player disconnects, upon disconnecting...

    - [ ] set this user's game room's player id (either 1 or 2, depending on this player's id), to an empty string. (remove any additional player specific info).
    - [ ] If both this user's game room's player 1 id and player 2 id are empty strings, remove the room.
    - [ ] set this user's room's "roomFull" key to false.

    - [ ] remove this player's profile.


  - [ ] 3. When the roomFull value changes:

    - [ ] If the value is true...
      - [ ] Turn the game on, and call any functions nessesary to begin the game.

    - [ ] If the value is false...
      - [ ] Turn the game off, and call any functions required to hide active game elements and display any "waiting for opponent" elements. 



      - [ ] They are assigned the monkier of Player 2, and the id of the room they are entering.
      - [ ] The room they are entering assigns Player 2's id to their "player 2 id" key
      - [ ]Player 1's profile's "opponent id" key is updated with Player 2's id. 
      - [ ]Player 2's "opponent id" is updated with Player 1's id.
    - [ ] If they can't be placed in an existing room, then...
      - [ ] A new game room is created with all nessesary game data.
        - [ ] The game room's id is captured and added to a local variable.
      - [ ] Their player profile/info is created.
      - [ ] They are assigned the monkiker of player 1, and the id of the game room that they are entering.
      - [ ] The room they are entering assigns Player 1's id to their "player 1 id" key.
  - [ ] The user is greeted by a sign-in window that has an input field and a submit button. 
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ] 
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]