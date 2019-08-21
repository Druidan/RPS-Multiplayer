$(document).ready(function(){ 

//Click Events

// --------------------------------------------------------
// --------------------------------------------------------

//When the player clicks the button to submit their display-name.
$(`.pNameBtn`).click( function(event){ 
    // First, prevent the default actions of the submit button.
    event.preventDefault();  
    //By default we first assume that the player's submitted name will be unique.
    let uniqueName = true; 
    //We grab the input of the player's name.
    submittedName = $(`.playerNameInput`).val().trim(); 
    // --------------------------------------------------------

    allUsers.once(`value`).then(function(snapshot){ //We check the All Players database reference to see if any other player already has that username.
        
        everyUser = snapshot.val(); //Establish a variable holding the value of the snapshot of all the users.
        
        let i = 0; //Establish an incrementable variable that we will use to determine if we should call our function again or not.
        
        //Begin For/In loop to go check each user in "All Users". 
        for(player in everyUser){
            
            const numUsers = snapshot.numChildren(); //Grab the number of all users in the snapshot. We will use this in comparison to the inrement variable defined above to see if we are done.

            currentPlayer = database.ref(`/allUsers/${player}`) //Establish a reference to the player in the database.

            currentPlayer.once(`value`).then(function(snapshot){//Use the created reference to take a snapshot of that player's information.

                p = snapshot.val() //Establish a snapshot value.

                if(p.name === submittedName){ //Complete an if statement to see if the submitted name is the same as the current user's name in the snapshot.

                    uniqueName = false; //If they are the same, the name is not unique.

                    continueSubmit() //Call the next function to continue the submission process. - We split the functions in order to successfully nest asynchronous calls and responses.
                }

                ++i //increment our incrementation value.

                if(i === numUsers){ //If our incrementer is the same as the number of ann users, then we have checked them all. If we have gotten to this point, the user's name is in fact still unique and... 

                    continueSubmit(); // ...we can continue with the submission process by calling the next function.
    } }) } });
    // --------------------------------------------------------

    function continueSubmit(){

        if(uniqueName){ //If the submitted name is unique, a local variable meant to hold this player's name is updated with this player's submitted name.

            playerName = submittedName;
            finishSubmit(); //Move on to the final step in the player creation process.

        } else{ //If the submitted name is not unique, we notify the user and prompt them to select a new username.
            $(`.instructionText`).text(`That name seems to be in use by another player. Please use a different name!`); 

    } };
    // --------------------------------------------------------

    function finishSubmit() { //This function finishes the player creation process.

        allGameRooms.once(`value`).then(function(snapshot) { //We check to see if there are game rooms in the game rooms directory of Firebase.

            everyRoom = snapshot.val();  //Establish a variable of the snapshot's data.

            let newRoom = false; //Establish a variable that we will change depending on if we will need a new game room or not.

        if(snapshot.numChildren() > 1){ //If the number of game rooms is greater than 1 then we need to check the rooms that exist to see if one is empty.

            j = 0; //We establish an increment variable that we will use to see if we are done.

            let playerAssigned = false; //At the start of our process, the player is not yet assigned to a room.

            for(room in everyRoom){ //We begin a for/in loop that will go through all of the rooms to check to see if they have an empty spot for our new player.

                currentRoom = database.ref(`/allGameRooms/${room}`) //We establish a reference to the room we are currently checking.

                currentRoom.once(`value`).then(function(rSnapshot){ //We take a snapshot of the current room.

                    if (!playerAssigned){ //If our player is still not assigned...

                        ++j //Increase the increment by one.

                        r = rSnapshot.val() //Establish a variable to hold the snapshot's data.

                        if(r.player1Id === ``){ //If this room's player 1 location is empty, we know we will be putting the player in this room.

                            myRoomKey = r.gameRoomId; //We fill our local variable with this room's game id.

                            thisPlayerNumber = 1; //This player's number is going to be 1, since they are entering a player 1 spot.

                            fbFunctions.createNewPlayer(); //We call the function that will create this player's data.

                            playerAssigned = true; // Since the player has been assigned, we set this value to true.

                        } else { //If this room's player 1 location is not empty...

                            if(r.player2Id === ``){ //...we will check to see if the player 2 spot is empty. If it is...

                                myRoomKey = r.gameRoomId; //We fill our local variable with this room's game id.

                                thisPlayerNumber = 2; //This player's number is going to be 2, since they are entering a player 2 spot.

                                fbFunctions.createNewPlayer(); //We call the function that will create this player's data.

                                playerAssigned = true; // Since the player has been assigned, we set this value to true.
                                
                            } else { // If this room has both a player 1 and a player 2...

                                newRoom = true; // ...we think we might need a new room. 

                                if(j === snapshot.numChildren()){ //If we have checked every room...

                                    checkForNewRoom(); //We call for the function that will check to see if we need a new room and create one if so.

                                    playerAssigned = true; //This player will be assigned to the new room, so this is set to true.

        } } } } }) } } else { //If the number of rooms is one or fewer...

            newRoom = true; // ... we know we will need a new game room, so we set our value to true.

            checkForNewRoom(); //We then call the function that checks our new Room value and then calls for the new room to be made.
        }

        myWins.text(`${wins}`) //Display my starting wins (0)

        myLosses.text(`${losses}`) //Display my starting losses (0)

        // --------------------------------------------------------

        function checkForNewRoom(){ //This function will check to see if we ever decided we needed a new room.

            if(newRoom) { //If we do need a new room...

                fbFunctions.createGameRoom(); //...Call for the function that creates a new room.

                thisPlayerNumber = 1; //Since this new room is being created for this player, the player's number is 1.

                fbFunctions.createNewPlayer(); //Call the function that creates this player's data.
        } }
        // --------------------------------------------------------
}) } });

// --------------------------------------------------------
// --------------------------------------------------------

$(`.startPlayBtn`).click( function(event){//When the Player hits the ready screen play button...
    event.preventDefault(); //...first, prevent the default actions of the submit button.
    setReady()
});

// --------------------------------------------------------
// --------------------------------------------------------

$(`.rpsSelection`).click( function(event){//When the player selects either Rock, Paper or Scissors by clicking on them.
    event.preventDefault();
    if(gameOn){
        gameOn = false;
        thisPlayerChoice = $(this).attr('id');
        if(thisPlayerNumber === 1){
            allGameRooms.child(myRoomKey).update({ // ...we update the player 1 choice information... 

                player1Choice: thisPlayerChoice, //...with this player's choice of rock, paper, or scissors.
    
                whatChanged: `playerChoice`, //We also notify the room of the change that has just occured.
            })
        } else if(thisPlayerNumber === 2){
            allGameRooms.child(myRoomKey).update({ // ...we update the player 2 choice information... 

                player2Choice: thisPlayerChoice, //...with this player's choice of rock, paper, or scissors.
    
                whatChanged: `playerChoice`, //We also notify the room of the change that has just occured.
            })
        }
} });

// --------------------------------------------------------
// --------------------------------------------------------

$(`.playAgainBtn`).click( function(event){//When the player clicks the Play Again Button.
    event.preventDefault();
    gameFunctions.resetGameState();
    setReady();
});

// --------------------------------------------------------
// --------------------------------------------------------

$(`.sayBtn`).click( function(event){//When the Player submits text to the chat.
    event.preventDefault();

});

// --------------------------------------------------------
// ------------SHARED ONCLICK FUNCTIONS BELOW--------------
// --------------------------------------------------------

function setReady() {
    if(imReady === false && thisPlayerNumber === 1){ //If this button has not already been clicked, and this player is player 1 in the room... 
        imReady = true;
        allGameRooms.child(myRoomKey).update({ // ...we update the player 1 ready information... 
            player1Ready: true, //...to show that this player is ready.
            whatChanged: `playerReady`, //We also notify the room of the change that has just occured.
        })
    } else if(imReady === false && thisPlayerNumber === 2){ //If this button has not already been clicked, and this player is number 2... 
        imReady = true;
        allGameRooms.child(myRoomKey).update({ //...we update the player 2 ready information...
            player2Ready: true, //...to show that this player is ready.
            whatChanged: `playerReady`, //We also notify the room of the change that has just occured.
}) } }

});