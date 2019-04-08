// When a user first visits the webpage: 
//  The document loads.
$(document).ready(function(){    //My JS starts past this point.

// Initialize Firebase
var config = {
    apiKey: `AIzaSyAqycBI1YOI5dZvzDnbiiDLItRcbe3h7qo`,
    authDomain: `unit-7-rock-paper-scissors.firebaseapp.com`,
    databaseURL: `https://unit-7-rock-paper-scissors.firebaseio.com`,
    projectId: `unit-7-rock-paper-scissors`,
    storageBucket: `unit-7-rock-paper-scissors.appspot.com`,
    messagingSenderId: `55092492997`
};
firebase.initializeApp(config);

//Firebase Variables
    const database = firebase.database(); //A variable that refers directly to the database.
    const allUsers = database.ref(`/allUsers`); //A variable that refers to the All Players directory.
    const allGameRooms = firebase.database().ref().child(`/allGameRooms`); //A variable that refers to the All Game Rooms directory.
    let playerKey; // Establish a variable that hold's this player's profile's push key.
    let myDir = `/allUsers/${playerKey}`; //Establish a variable that holds this player's direct directory path on Firebase.
    const myDirRef = database.ref(myDir); // This variable can be used to directly reference this player's directory.
    let myRoomKey; //Establish a variable that hold this player's game room's push key.
    let myRoom = database.ref(`allGameRooms/${myRoomKey}`); // Establish a variable that hold this player's room's direct directory path on Firebase.
    let myRoomRef = allGameRooms.child(`${myRoomKey}`);
    let roomFullRef = database.ref('/allGameRooms/' + myRoomKey);// + '/roomFull'
    const connectedRef = database.ref(`.info/connected`); //This Variable refers directly to the information reference that tells us if we are connected or not.

//If no directories exist, create directories.
database.ref().once(`value`).then(function(snapshot){
    if(snapshot.val() === null){// || allUsers === null || allUsers === undefined){
        allUsers.push('Initial All Users Push to Directory');
        allGameRooms.push('Initial All Game Room Push to Directory')
    }
})

//Global Variables
let playerName;
let thisPlayerNumber;
let thisPlayerChoice;
let wins = 0;
let losses = 0;
let opponentName;
let imReady = false;

//Establish the basic rules of rock, paper, scissors using an object.
const weapons = { //The idea to use an object to hold information on what beats what is based off of an answer by Federkun on Stack Overflow. Source - "https://stackoverflow.com/questions/53730900/more-efficient-choice-comparison-for-rock-paper-scissors"
    rock: {beats: 'scissors'},
    paper: {beats: 'rock'},
    scissors: {beats: 'paper'},
}

// Game States
let readyCheck = false;
let gameOn = false;

// HTML Variables
const titleDiv = $(`.titleDiv`);
const winLossDiv = $(`.win-loss-div`);
const anouncement = $(`.win-loss-anouncement`);
const introScreen = $(`.intro-screen`);
const readyScreen = $(`.ready-screen`);
const gameOnScreen = $(`.gameOn-screen`);
const rpsButtons = $(`.rpsButtonRow`);
const endScreen = $(`.end-screen`);
const myWins = $(`.winsDisplay`);
const myLosses = $(`.lossesDisplay`);
const chatRow = $(`.chatRow`);
const player1Name = $(`.player1`);
const player2Name = $(`.player2`);

// intervalId = 0;



//Game Functions
gameFunctions = {
    firebaseListeners: function() {
        // -----------------------------------

        connectedRef.on(`value`, function(conSnap){ 
            console.log(`I'm Connected!`)
        }, function(errorObject) {
            console.log(`The read failed: ${errorObject.code}`);
        });

        // -----------------------------------

        allGameRooms.on(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            miroom = roomsSnapshot.val();
            theChange = miroom.whatChanged;
            switch(theChange){
                case `nothing`:
                    break;

                case `playerPresence`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.checkPlayerPresence();
                    break;

                case `playerReady`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.checkPlayerReady();
                    break;

                case `player1message`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.handlePlayer1Message();
                    break;

                case `player2message`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.handlePlayer2Message();
                    break;

                case `playerChoice`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.checkPlayerChoice();
                    break;

                case `roundResult`:
                    gameFunctions.resetWhatChanged();
                    gameFunctions.displayResults();
                    break;
            }
        });
    },
    // --------------------------------------------------------

    createGameRoom: function(){ // This function creates a new game room.
        makeRoom = allGameRooms.push({ //Create a push that sends all game state data for this game room to Firebase.
            whatChanged: `nothing`,
            gameRoomId: ``,
            // roomFull: false,
            readyCheck: false,
            gameOn: false,
            endScreen: false,
            playerReady: false,
            opponentReady: false,
            player1Id: ``,
            player1Ready: ``,
            player1Choice: ``,
            player2Id: ``,
            player2Ready: ``,
            player2Choice: ``,
            roundResult: ``,
            // clockRunning: false,
        })
        myRoomKey = makeRoom.key; //Grab the unique key of the game room's push.
        pushRoomId(); //Call the function that will now use the key that was just grabbed.
        function pushRoomId(){
            allGameRooms.child(myRoomKey).update({ // Target the game room we just created and then update its gameRoom Id property with its key.
                gameRoomId: myRoomKey, 
            });
        }
    },
    // --------------------------------------------------------

    createNewPlayer: function(){ //This function creates a new player.
        thisPlayer = allUsers.push({ //create and capture a push to Firebase with the new player data.
            name: playerName,
            myId: ``,
            wins: 0,
            losses: 0,
            playerPick: ``,
            playerNumber: thisPlayerNumber,
            connected: true,
            // playerReady: false,
            // playerChoiceMade: false,
            // hasOpponent: false,
            // opponentId: ``,
            gameRoomId: myRoomKey,
        });
        playerKey = thisPlayer.key; //Grab the key of the push we just made.
        allUsers.child(playerKey).update({
            myId: playerKey,
        });
        if(thisPlayerNumber === 1){
            allGameRooms.child(myRoomKey).update({
                player1Id: playerKey,
                whatChanged: `playerPresence`,
            });
            allGameRooms.child(myRoomKey).onDisconnect().update({
                roomFull: false,
                player1Id: ``,
                whatChanged: `playerPresence`,
            });
        } else if(thisPlayerNumber === 2){
            allGameRooms.child(myRoomKey).update({
                player2Id: playerKey,
                whatChanged: `playerPresence`,
            });
            allGameRooms.child(myRoomKey).onDisconnect().update({
                roomFull: false,
                player2Id: ``,
                whatChanged: `playerPresence`,
            });
        };
        thisPlayer.onDisconnect().remove(); //If this player disconnects, remove them from Firebase.
    },
    // --------------------------------------------------------

    closeEmptyRooms: function(){
        allGameRooms.once(`value`).then(function(snapshot) {
            eachRoom = snapshot.val();
            for(room in eachRoom){
                const currentRoom = database.ref(`/allGameRooms/${room}`)
                currentRoom.once(`value`).then(function(rSnapshot){
                    r = rSnapshot.val()
                    if(r.player1Id === `` && r.player2Id === ``){
                        allGameRooms.child(room).remove();
    } }) } }) },
    // --------------------------------------------------------

    resetWhatChanged: function(){
        allGameRooms.child(myRoomKey).update({
            whatChanged: `nothing`,
    }); },
    // --------------------------------------------------------

    checkPlayerPresence: function(){
        allGameRooms.once(`value`, function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            p1Id = myroom.player1Id;
            p2Id = myroom.player2Id;
            if(p1Id !== `` && p2Id !== ``){
                gameFunctions.grabOpponentName();
            } else{
                $(`.instructionText`).text(`Waiting For an Opponent.`); 
    } }); },
    // --------------------------------------------------------

    grabOpponentName: function(){

        if(thisPlayerNumber === 1){
            allGameRooms.once(`value`, function(snap) {
                const roomsSnapshot = snap.child(`${myRoomKey}`);
                const myroom = roomsSnapshot.val();
                const opponentId = myroom.player2Id;
                allUsers.once(`value`, function(snap2){
                    const opponent = snap2.child(`${opponentId}`);
                    const trueOpponent = opponent.val()
                    opponentName = trueOpponent.name;
                    gameFunctions.readyCheck();

        }) }) } else if(thisPlayerNumber === 2){

            allGameRooms.once(`value`, function(snap) {
                const roomsSnapshot = snap.child(`${myRoomKey}`);
                const myroom = roomsSnapshot.val();
                const opponentId = myroom.player1Id;
                allUsers.once(`value`, function(snap2){
                    const opponent = snap2.child(`${opponentId}`);
                    const trueOpponent = opponent.val()
                    opponentName = trueOpponent.name;
                    gameFunctions.readyCheck();
        }) }) } },
    // --------------------------------------------------------

    readyCheck: function(){
        if(!readyCheck){
            readyCheck = true
            if(!introScreen.hasClass(`buryIt`)){
                introScreen.addClass(`buryIt`);
            }
            if(readyScreen.hasClass(`buryIt`)){
                readyScreen.removeClass(`buryIt`)
            }
            if(chatRow.hasClass(`buryIt`)){
                chatRow.removeClass(`buryIt`)
            }
    } },
    // --------------------------------------------------------

    checkPlayerReady: function(){
        allGameRooms.once(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            p1Ready = myroom.player1Ready;
            p2Ready = myroom.player2Ready;
            if(p1Ready && p2Ready){
                gameFunctions.gameStart();
            } else if(imReady) {
                $(`.readyText`).text(`Waiting For ${opponentName}.`); 
            }
        });
    },
    // --------------------------------------------------------

    gameStart: function(){
        readyCheck = false;
        if(!gameOn){
            gameOn = true;
            if(!readyScreen.hasClass(`buryIt`)){
                readyScreen.addClass(`buryIt`)
            }
            if(gameOnScreen.hasClass(`buryIt`)){
                gameOnScreen.removeClass(`buryIt`)
                if(thisPlayerNumber === 1){
                    player1Name.text(`${playerName}`)
                    player2Name.text(`${opponentName}`)
                }
                if(thisPlayerNumber === 2){
                    player2Name.text(`${playerName}`)
                    player1Name.text(`${opponentName}`)
                }
            }
            if(rpsButtons.hasClass(`buryIt`)){
                rpsButtons.removeClass(`buryIt`)
            }
    } },
    // --------------------------------------------------------

    checkPlayerChoice: function(){
        allGameRooms.once(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            const p1Choice = myroom.player1Choice;
            const p2Choice = myroom.player2Choice;
            if(p1Choice !== `` && p2Choice !== ``){
                if(p1Choice === p2Choice){ //If the player choices are the same...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: `tie`, //...to show that the result is a tie.
            
                        whatChanged: `roundResult`, //We also notify the room of the change that has just occured.
                    })
                } else if(weapons[p1Choice].beats === p2Choice){ // But, if player 1's choice beats player 2's choice...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: `p1Wins`, //...to show that player 1 wins.
            
                        whatChanged: `roundResult`, //We also notify the room of the change that has just occured.
                    })

                } else { //But if it's not a tie, and player 1's choice doesn't beat player 2's choice...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: `p2Wins`, //...to show that player2 wins.
            
                        whatChanged: `roundResult`, //We also notify the room of the change that has just occured.
                    })
                }
            } else {
                //Notify this player that they're waiting on the opponent's choice.
            }
        });
    },
    // --------------------------------------------------------

    displayResults: function(){
        allGameRooms.once(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            const winner = myroom.roundResult;
            switch(winner) {
                case `tie`:
                    gameFunctions.itsATie();
                    break;
                case `p1Wins`:
                    gameFunctions.player1Wins();
                    break;
                case `p2Wins`:
                    gameFunctions.player2Wins();
                    break;
            }
            if(!gameOnScreen.hasClass(`buryIt`)){
                gameOnScreen.addClass(`buryIt`)
                titleDiv.addClass(`buryIt`)
            }
            if(winLossDiv.hasClass(`buryIt`)){
                winLossDiv.removeClass(`buryIt`)
                endScreen.removeClass(`buryIt`)
            }
        });
    },
    // --------------------------------------------------------

    handlePlayer1Message: function(){
        allGameRooms.once(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
        });
    },
    // --------------------------------------------------------

    handlePlayer2Message: function(){
        allGameRooms.once(`value`, function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
        });
    },
    // --------------------------------------------------------

    itsATie: function(){
        anouncement.text(`It's a Tie!`)
    },
    // --------------------------------------------------------
    
    player1Wins: function(){
        if(thisPlayerNumber === 1){
            anouncement.text(`You Win!`)
            wins++
            allUsers.child(playerKey).update({
                wins: wins,
            });
            myWins.text(`${wins}`)
        } else if (thisPlayerNumber === 2){
            anouncement.text(`${opponentName} Wins!`)
            losses++
            allUsers.child(playerKey).update({
                losses: losses,
            });
            myLosses.text(`${losses}`)
        }
    },
    // --------------------------------------------------------
    
    player2Wins: function(){
        if(thisPlayerNumber === 2){
            anouncement.text(`You Win!`)
            wins++
            allUsers.child(playerKey).update({
                wins: wins,
            });
            myWins.text(`${wins}`)
        } else if (thisPlayerNumber === 1){
            anouncement.text(`${opponentName} Wins!`)
            losses++
            allUsers.child(playerKey).update({
                losses: losses,
            });
            myLosses.text(`${losses}`)
        }
    },
    // --------------------------------------------------------
};

//If there are empty rooms still in the directory, delete them before proceeding
gameFunctions.closeEmptyRooms();

//Constructors and Prototypes 
function sound(src) { //This makes the sound objects that are used when cards are made.
    this.sound = document.createElement(`audio`);
    this.sound.src = src;
    this.sound.setAttribute(`preload`, `auto`);
    this.sound.setAttribute(`controls`, `none`);
    this.sound.style.display = `none`;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

//Click Events

// --------------------------------------------------------
// --------------------------------------------------------

$(`.pNameBtn`).click( function(event){ //When the player clicks the button to submit their display-name.
    event.preventDefault();  // First, prevent the default actions of the submit button.
    
    let uniqueName = true; //By default we first assume that the player's submitted name will be unique.
    
    submittedName = $(`.playerNameInput`).val().trim(); //We grab the input of the player's name.
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

                            gameFunctions.createNewPlayer(); //We call the function that will create this player's data.

                            playerAssigned = true; // Since the player has been assigned, we set this value to true.

                        } else { //If this room's player 1 location is not empty...

                            if(r.player2Id === ``){ //...we will check to see if the player 2 spot is empty. If it is...

                                myRoomKey = r.gameRoomId; //We fill our local variable with this room's game id.

                                thisPlayerNumber = 2; //This player's number is going to be 2, since they are entering a player 2 spot.

                                gameFunctions.createNewPlayer(); //We call the function that will create this player's data.

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

                gameFunctions.createGameRoom(); //...Call for the function that creates a new room.

                thisPlayerNumber = 1; //Since this new room is being created for this player, the player's number is 1.

                gameFunctions.createNewPlayer(); //Call the function that creates this player's data.
        } }
        // --------------------------------------------------------
}) } });

// --------------------------------------------------------
// --------------------------------------------------------

$(`.startPlayBtn`).click( function(event){//When the Player hits the ready screen play button...
    event.preventDefault(); //...first, prevent the default actions of the submit button.

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
}) } });

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


});

// --------------------------------------------------------
// --------------------------------------------------------

$(`.sayBtn`).click( function(event){//When the Player submits text to the chat.
    event.preventDefault();

});

//Call database Listeners
gameFunctions.firebaseListeners();




//My JS Ends beyond this point.
});