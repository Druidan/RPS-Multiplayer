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
    const allGameRooms = database.ref(`/allGameRooms`); //A variable that refers to the All Game Rooms directory.
    let playerKey; // Establish a variable that hold's this player's profile's push key.
    let myDir = `/allUsers/${playerKey}`; //Establish a variable that holds this player's direct directory path on Firebase.
    const myDirRef = database.ref(myDir); // This variable can be used to directly reference this player's directory.
    let myRoomKey; //Establish a variable that hold this player's game room's push key.
    const myRoom = `/allGameRooms/${myRoomKey}`; // Establish a variable that hold this player's room's direct directory path on Firebase.
    const myRoomRef = database.ref(myRoom);  // This variable can be used to directly reference this player's room's directory.
    const connectedRef = database.ref(`.info/connected`); //This Variable refers directly to the information reference that tells us if we are connected or not.

//If no directories exist, create directories.
database.ref().once(`value`).then(function(snapshot){
    if(snapshot.val() === null){// || allUsers === null || allUsers === undefined){
        allUsers.push('Initial All Users Push to Directory');
        allGameRooms.push('Initial All Game Room Push to Directory')
    }
})


    let thisPlayer;

    let emptyRoom;


//Global Variables
let playerName;
let thisPlayerNumber;


// let totalPlayers = 0;
// const player1Name = $(`.player1`);
// const player2Name = $(`.player2`);
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

        myRoomRef.ref(`.roomFull`).on(`value`, function(roomFullSnap){ 
            console.log(`Checking If the Room is Full!`);
            if(roomFullSnap.val()){
                console.log(`The Room is full!`)
            } else {
                console.log(`The Room isn't full!`)
            }
        }, function(errorObject) {
            console.log(`The read failed: ${errorObject.code}`);
        });
        // -----------------------------------

        myRoomRef.ref(`.readyCheck`).on(`value`, function(readyCheckSnap){ 
            if(readyCheckSnap.val()){

            } else {

            }
        }, function(errorObject) {
            console.log(`The read failed: ${errorObject.code}`);
        });
        // -----------------------------------

        myRoomRef.ref(`.gameOn`).on(`value`, function(gameOnSnap){ 
            if(gameOnSnap.val()){

            } else {

            }
        }, function(errorObject) {
            console.log(`The read failed: ${errorObject.code}`);
        });
        // -----------------------------------

        myRoomRef.ref(`.endScreen`).on(`value`, function(endScreenSnap){ 
            if(endScreenSnap.val()){

            } else {

            }
        }, function(errorObject) {
            console.log(`The read failed: ${errorObject.code}`);
        });
        // -----------------------------------



    },
    // userConnect: function(){
    //     if(gameOn && totalPlayers === 0) {
    //         name = $(`.playerNameInput`).val().trim();
    //         allUsers.child(playerKey).update({
    //             name: name,
    //             nameAdded: true,
    //             firstEntry: true,
    //         });
    //     } else if (gameOn && totalPlayers === 1) {
    //         name = $(`.playerNameInput`).val().trim();
    //         allUsers.child(playerKey).update({
    //             name: name,
    //             nameAdded: true,
    //         });
    //     }
    // },
    createGameRoom: function(){ // This function creates a new game room.
        makeRoom = allGameRooms.push({ //Create a push that sends all game state data for this game room to Firebase.
            gameRoomId: ``,
            roomFull: false,
            readyCheck: false,
            gameOn: false,
            endScreen: false,
            playerReady: false,
            opponentReady: false,
            player1Id: ``,
            player1Choice: ``,
            player1Chose: false,
            player2Id: ``,
            player2Choice: ``,
            player2Chose: false,
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
    // kickPlayer: function(){
    //     if(allUsers.child(playerKey).playerNumber === 1){
    //         allGameRooms.child(myGameRoom).update({
    //             player1Id: ``,
    //         })
    //     } else{
    //         if (allUsers.child(playerKey).playerNumber === 2){
    //             allGameRooms.child(myGameRoom).update({
    //                 player2Id: ``,
    //             })
    //         } 
    //     }
    // },
    createNewPlayer: function(){ //This function creates a new player.
        thisPlayer = allUsers.push({ //create and capture a push to Firebase with the new player data.
            name: playerName,
            myId: ``,
            wins: 0,
            loses: 0,
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
            });
            if(!myRoomRef.player2Id === ``){
                allGameRooms.child(myRoomKey).update({
                    roomFull: true,
                });
            };
            allGameRooms.child(myRoomKey).onDisconnect().update({
                player1Id: ``
            });
        } else if(thisPlayerNumber === 2){
            allGameRooms.child(myRoomKey).update({
                player2Id: playerKey,
            })
            if(!myRoomRef.player1Id === ``){
                allGameRooms.child(myRoomKey).update({
                    roomFull: true,
                })
            }
            allGameRooms.child(myRoomKey).onDisconnect().update({
                player2Id: ``
            });
        };
        thisPlayer.onDisconnect().remove(); //If this player disconnects, remove them from Firebase.
    },
    closeEmptyRooms: function(){
        allGameRooms.once(`value`).then(function(snapshot) {
            eachRoom = snapshot.val();
            for(room in eachRoom){
                currentRoom = database.ref(`/allGameRooms/${room}`)
                currentRoom.once(`value`).then(function(rSnapshot){
                    r = rSnapshot.val()
                    if(r.player1Id === `` && r.player2Id === ``){
                        allGameRooms.child(room).remove();
                    }
                })
            }
        })
    }
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
$(`.pNameBtn`).click( function(event){ //When the player clicks the button to submit their display-name.
    event.preventDefault();
    let uniqueName = true;
    submittedName = $(`.playerNameInput`).val().trim();
    allUsers.once(`value`).then(function(snapshot){ //We check the All Players database reference to see if any other player already has that username.
        everyUser = snapshot.val();
        let i = 0;
        for(player in everyUser){
            const numUsers = snapshot.numChildren();
            currentPlayer = database.ref(`/allUsers/${player}`)
            currentPlayer.once(`value`).then(function(snapshot){
                p = snapshot.val()
                if(p.name === submittedName){
                    uniqueName = false;
                    continueSubmit()
                }
                ++i
                if(i === numUsers){
                    continueSubmit();
                }
            })
        }
    });
    function continueSubmit(){
        if(uniqueName){ //If no other player has that username, a local variable meant to hold this player's name is updated with this player's submitted name.
            playerName = submittedName;
            finishSubmit();
        } else{ //If another player already has that username, we notify the user and prompt them to select a new username.
            $(`.instructionText`).text() = `That name seems to be in use. Please use a different name!`
        }
    };
    function finishSubmit() {
        allGameRooms.once(`value`).then(function(snapshot) { //We check to see if there are game rooms in the game rooms directory of Firebase.
        everyRoom = snapshot.val();
        let newRoom = false;
        if(snapshot.numChildren() > 1){
            j = 0;
            let playerAssigned = false;
            for(room in everyRoom){
                currentRoom = database.ref(`/allGameRooms/${room}`)
                currentRoom.once(`value`).then(function(rSnapshot){
                    if (!playerAssigned){
                        ++j
                        r = rSnapshot.val()
                        if(r.gameRoomId === ``){ //Remove Ghost Rooms
                            rSnapshot.remove();
                        };
                        if(r.player1Id === `` && r.player2Id === ``){
                            rSnapshot.remove();
                        }
                        if(r.player1Id === ``){
                            myRoomKey = r.gameRoomId;
                            thisPlayerNumber = 1;
                            gameFunctions.createNewPlayer();
                            playerAssigned = true;
                        } else {
                            console.log(`there is no player 1`)
                            if(r.player2Id === ``){
                                myRoomKey = r.gameRoomId;
                                thisPlayerNumber = 2;
                                gameFunctions.createNewPlayer();
                                playerAssigned = true;
                            } else {
                                console.log(`there is no player 2`)
                                newRoom = true;
                                if(j === snapshot.numChildren()){
                                    console.log(j)
                                    console.log(snapshot.numChildren())
                                    checkForNewRoom();
                                    playerAssigned = true;
                                }
                            }
                        }
                    }
                })
            }
        } else {
            console.log(`I'm Triggered`)
            newRoom = true;
            checkForNewRoom();
        }
        function checkForNewRoom(){
            console.log(`4`)
            if(newRoom) {
                gameFunctions.createGameRoom();
                thisPlayerNumber = 1;
                gameFunctions.createNewPlayer();
            }
        }
        })
    }
});

$(`.startPlayBtn`).click( function(event){//When the Player hits the start screen polay button.
    event.preventDefault();
    gameOn = true;
    gameFunctions.userConnect();
});

$(`.rpsSelectopn`).click( function(event){//When the player selects either Rock, Paper or Scissors by clicking on them.
    event.preventDefault();

});

$(`.playAgainBtn`).click( function(event){//When the player clicks the Play Again Button.
    event.preventDefault();

});

$(`.sayBtn`).click( function(event){//When the Player submits text to the chat.
    event.preventDefault();

});

//Call database Listeners
gameFunctions.firebaseListeners();




//My JS Ends beyond this point.
});