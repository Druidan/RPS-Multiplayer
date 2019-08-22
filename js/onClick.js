$(document).ready(function(){ 

//Click Events

// --------------------------------------------------------
// ****************** Submit Name Button ******************
// --------------------------------------------------------
// When clicking to submit their player name, proceed with username validation, 
// determine which game room to place the user in - or create a new game room - 
// and call the appropriate functions that will do so.
$(`.pNameBtn`).click( function(event){ 
    event.preventDefault();  
    // By default we first assume that the player's submitted name will be unique,
    // then we grab the input of the player's name.
    let uniqueName = true; 
    submittedName = $(`.playerNameInput`).val().trim(); 
    // --------------------------------------------------------

    // Check the All Players database reference to see if any other player already has that username.
    allUsers.once(`value`).then(function(snapshot){ 
        everyUser = snapshot.val(); 
        //Establish an incrementable variable that we will use to determine if we should call our function again or not.
        let i = 0; 
        // Until our increment value is the same as the number of users, check 
        // each player's data to see if they have the same name as the submitted name.
        // If the user's name is not unique, capture that information in the uniqueName 
        // variable, otherwise continue the submission process as normal.
        for(player in everyUser){
            const numUsers = snapshot.numChildren(); 
            currentPlayer = database.ref(`/allUsers/${player}`) 
            currentPlayer.once(`value`).then(function(snapshot){ 
                p = snapshot.val()
                if(p.name === submittedName){ 
                    uniqueName = false;
                    continueSubmit()
                }
                ++i //increment our incrementation value.
                if(i === numUsers){ 
                    continueSubmit(); 
    } }) } });
    // --------------------------------------------------------

    // Continue the name submission process by checking the results of checking the 
    // database for identical names. If the result is a unique name, proceed to the 
    // final step, otherwise notify the user to resubmit a new name.
    function continueSubmit(){
        if(uniqueName){
            playerName = submittedName;
            finishSubmit();
        } else{ 
            $(`.instructionText`).text(`That name seems to be in use by another player. Please use a different name!`); 
    } };
    // --------------------------------------------------------

    // To finish the player creation process, we check for game rooms in the game 
    // rooms directory. If there is more than 1 room we check each room for an empty 
    // player slot, 1 or 2, and assign them there if so.
    function finishSubmit() { 
        allGameRooms.once(`value`).then(function(snapshot) {
            everyRoom = snapshot.val();
            let newRoom = false; 
        if(snapshot.numChildren() > 1){
            j = 0;
            let playerAssigned = false; 
            for(room in everyRoom){
                currentRoom = database.ref(`/allGameRooms/${room}`) 
                currentRoom.once(`value`).then(function(rSnapshot){ 
                    // If our player is still not assigned, increase the increment by one.
                    if (!playerAssigned){ 
                        ++j
                        r = rSnapshot.val()
                        // This if statement makes the empty player slot check. First 
                        // for player one, then player 2. If either is empty, it grabs 
                        // the room's number and then calls for the create player function.
                        if(r.player1Id === ``){ 
                            myRoomKey = r.gameRoomId;
                            thisPlayerNumber = 1;
                            fbFunctions.createNewPlayer();
                            playerAssigned = true;
                        } else { 
                            if(r.player2Id === ``){
                                myRoomKey = r.gameRoomId;
                                thisPlayerNumber = 2; 
                                fbFunctions.createNewPlayer(); 
                                playerAssigned = true;
                            } else { 
                                // If there are no empty slots, we make a new room. 
                                newRoom = true;
                                if(j === snapshot.numChildren()){ 
                                    checkForNewRoom();
                                    playerAssigned = true; 
        } } } } }) } } else { 
            // If the number of rooms is one or fewer we know we will need a new game room, 
            // so we set our value to true. We then call the new room function.
            newRoom = true;
            checkForNewRoom();
        }
        //Display my starting wins and loses (0)
        myWins.text(`${wins}`)
        myLosses.text(`${losses}`)
        // --------------------------------------------------------

        // This function will checks to see if we need a new room. If so, it calls 
        // for the function that creates a new room. It establishes this player as
        // player 1 for the new room and calls the function to make their data.
        function checkForNewRoom(){ 
            if(newRoom) { 
                fbFunctions.createGameRoom();
                thisPlayerNumber = 1; 
                fbFunctions.createNewPlayer();
        } }
}) } }); // --------------------------------------------------------

// --------------------------------------------------------
// ****************** Start Play Button *******************
// --------------------------------------------------------
// When the Player hits the ready screen play button, call the setReady function it shares
// with the play again button.
$(`.startPlayBtn`).click( function(event){
    event.preventDefault();
    setReady();
});

// --------------------------------------------------------
// ******** Select Rock, Paper or Scissors Buttons ********
// --------------------------------------------------------
// When the player selects either Rock, Paper or Scissors by clicking on them, we update 
// the room with the player(1 or 2)'s choice data, and notify the room that a choice was made.
$(`.rpsSelection`).click( function(event){
    event.preventDefault();
    if(gameOn){
        gameOn = false;
        thisPlayerChoice = $(this).attr('id');
        if(thisPlayerNumber === 1){
            allGameRooms.child(myRoomKey).update({ 
                player1Choice: thisPlayerChoice,
                whatChanged: `playerChoice`,
            })
        } else if(thisPlayerNumber === 2){
            allGameRooms.child(myRoomKey).update({ 
                player2Choice: thisPlayerChoice,
                whatChanged: `playerChoice`,
}) } } }); // --------------------------------------------------------

// --------------------------------------------------------
// ****************** Play Again Button *******************
// --------------------------------------------------------
// When the player clicks the Play Again Button, .
$('.playAgainBtn').click( function(event){
    event.preventDefault();
    if (imReady === false){
        playAgain.text(`Here We Go, ${playerName}!`)
        gameFunctions.resetGameState();
    }
    setReady();
}); // --------------------------------------------------------

// --------------------------------------------------------
// ***************** Submit Chat Button *******************
// --------------------------------------------------------
// When the Player submits text to the chat, send it through the validation function. 
// If it passes the validation criteria, post the chat to the chat log.
$(`.sayBtn`).click( function(event){
    event.preventDefault();
    const myMessage = $(`.chatBox`).val().trim();
    if (validateChat(myMessage) && thisPlayerNumber === 1) {
        gameFunctions.handlePlayer1Message(myMessage);
    } else if (validateChat(myMessage) && thisPlayerNumber === 2) {
        gameFunctions.handlePlayer2Message(myMessage);
    } else {
        chatBox.text(chatNotification);
    }

}); // --------------------------------------------------------

// --------------------------------------------------------
// *************** ONCLICK FUNCTIONS BELOW ****************
// --------------------------------------------------------

// 
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
}) } }; // --------------------------------------------------------

//Check the submitted name to make sure it fits the following conditions, and if 
// it does not, send notifications to the player how to adjust their next submission.
function validateName(name) {
    validName = false;
    if (name !== '' && name !== null && name !== undefined) {
        validName = true;
    } else { nameNotification = "It looks like you didn't type anything. Please write a message before hitting 'Say!'"; }
    
    return validName;
};

//Check the submitted message to make sure it fits the following conditions, and if 
// it does not, send notifications to the player how to adjust their next submission.
function validateChat(chat) {
    validChat = false;
    if (chat !== '' && chat !== null && chat !== undefined) {
        validChat = true;
    } else { chatNotification = "It looks like you didn't type anything. Please write a message before hitting 'Say!'"; }
    
    return validChat;
};

});