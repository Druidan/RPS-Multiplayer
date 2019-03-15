$(document).ready(function(){    //My JS starts past this point.

//Pseudocode, Instruction Notes, and checklist commentary: 
// 



// Initialize Firebase
var config = {
    apiKey: "AIzaSyAqycBI1YOI5dZvzDnbiiDLItRcbe3h7qo",
    authDomain: "unit-7-rock-paper-scissors.firebaseapp.com",
    databaseURL: "https://unit-7-rock-paper-scissors.firebaseio.com",
    projectId: "unit-7-rock-paper-scissors",
    storageBucket: "unit-7-rock-paper-scissors.appspot.com",
    messagingSenderId: "55092492997"
};
firebase.initializeApp(config);

//Firebase Variables
    const database = firebase.database();
    const dataRef = database.ref();
    const allUsers = database.ref("/allUsers");
    const allGameRooms = database.ref("/allGameRooms");
    const currentEmptyRoom = database.ref("/currentEmptyRoom");
    const emptyRoomId = database.ref("/currentEmptyRoom/emptyRoomId");
    let userNum = database.ref("/userNum");
    let deepUserNum = database.ref("/userNum/0");
    let userTicker = 0;
    let thisPlayer;
    let playerKey;
    let myGameRoom;
    let emptyRoom;
    const connectedRef = database.ref(".info/connected");

//Global Variables
let totalPlayers = 0;
const player1Name = $(".player1");
const player2Name = $(".player2");
intervalId = 0;


//Game Functions
gameFunctions = {
    firebaseListeners: function() {
        connectedRef.on("value", function(conSnap){ //Listener to see when a user is connected.
            // if(currentEmptyRoom == null){
            //     currentEmptyRoom.remove()
            //     currentEmptyRoom.child(emptyRoom).set({
            //         emptyRoomId: ""
            //     })
            // }
            if (conSnap.val()){ //If the user is connected...
                allGameRooms.once("value", function(roomSnap){ //grab a snapshot of the data the the all Game Rooms Directory.
                    const allRooms = roomSnap.val()
                    if(!roomSnap.exists()){ //If there are no game rooms the following happens:
                        createFromScratchP1() //Calls all a catch-all function that generates the game room and player data for player 1.
                    } else {
                        if(roomSnap){ //However, if there are Rooms...
                            //First we need to make sure the room(s) in here are not left over from a previous session.
                            userNum.once("value", function(userSnap2){ //Take a snapshot of the user counter.
                                let userSnap = userSnap2.val(); // Establish the variable targetting the snapshot's value.
                                myTicker = userSnap[0]; //Further focus the targetting variable.
                                console.log(userSnap);
                                if(myTicker.userTicker === 0){ //If the number of users in the Firebase is 0 on arrival...
                                    allGameRooms.remove(); //Remove any game rooms that remain from previous sessions.
                                    allUsers.remove(); //If any user data remain despite being disconnected. remove it.
                                    createFromScratchP1(); //Calls all a catch-all function that generates the game room and player data for player 1.      
                                }
                            })
                            playerAssigned = false;
                            const roomsByKey = allGameRooms.orderByKey();
                            roomsByKey.once("value", function(snapshot){
                                snapshot.forEach(function(childSnap){
                                    let childProps = childSnap.val();
                                    if (childProps.player2Id === ""){
                                        gameFunctions.createNewPlayer();
                                        targetGameRoom = childProps.gameRoomId
                                        targetOpponent = targetGameRoom.player1Id
                                        console.log(targetGameRoom.player1Id)
                                        allUsers.child(playerKey).update({
                                            gameRoomId: targetGameRoom,
                                            player2Id: playerKey,
                                            playerNumber: 2,
                                            opponentId: targetOpponent,
                                        })
                                        allUsers.child(targetOpponent).update({
                                            opponentId: playerKey,
                                        })
                                        allGameRooms.child(targetGameRoom).update({
                                            player2Id: playerKey,
                                        })
                                        playerAssigned = true;
                                    }
                                }) 
                            })
                            // .then(function(snapshot){
                            //     console.log(snapshot.val())
                                allRoomsFilled();
                            // })
                            function allRoomsFilled(){
                                if(playerAssigned === false) {
                                    createFromScratchP1();
                                }
                            };

                            // currentEmptyRoom.once("value", function(emptySnap){
                            //     checkEmptyRoom = emptySnap.val()
                            //     console.log(emptyRoomId);
                            //     emptyRoom = allGameRooms.child(checkEmptyRoom)
                            //     if(roomSnap.val() && emptyRoom.player2Id === ""){ //If there are Rooms but there is an empty room...
                                    
                            //     } else{
                            //         if(roomSnap.val()){ //If there are Rooms but there are no empty rooms...

                            //         }
                            //     }
                            // })
                        }
                    }
                allUsers.once("value", function(captureUserCount){
                    users = captureUserCount.numChildren()
                    if(deepUserNum.child(users)){
                        userNum.child(0).update({ 
                        userTicker: users
                        })
                    } else {
                        userNum.child(userTicker).set({ 
                            userTicker: 1
                            })
                    }
                });
                })
            };
            function createFromScratchP1(){
                gameFunctions.createGameRoom(); //Call the function that creates a game room.
                gameFunctions.createNewPlayer(); //Call the function that creates a new player.
                allUsers.child(playerKey).update({ //Once both the new room and player are created, connect the player to the new game room, by updating their data for their game room Id, their own player Id, and their player number.
                    gameRoomId: myGameRoom,
                    player1Id: playerKey,
                    playerNumber: 1,
                })
                allGameRooms.child(myGameRoom).update({ //Also update the game room with player Id data, further connecting the two.
                    player1Id: playerKey,
                })
            }
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        allUsers.on("child_removed", function(disconnectedSnap){
            disconnected = disconnectedSnap.val()
            if (disconnected.playerNumber === 1){
                thisRoom = disconnected.gameRoomId;
                console.log(thisRoom);
                allGameRooms.child(thisRoom).update({
                    player1Id: "",
                });
                console.log(allGameRooms.child(thisRoom));
            } else{
                if (disconnected.playerNumber === 2){
                    allGameRooms.child(disconnected.gameRoomId).update({
                        player2Id: "",
                    })
                }
            }
            gameFunctions.closeEmptyRooms();
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        allUsers.on("child_changed", function(snapshot) {
            if(totalPlayers === 0) {
                player = snapshot.val();
                player1Name.text(player.name);
                totalPlayers++;
            } else {
                opponent = snapshot.val();
                if(totalPlayers === 1 && snapshot.val().firstEntry === false){
                        player2Name.text(opponent.name);
                        totalPlayers++;
                        //Start Game
                }
            }
        }, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    },
    userConnect: function(){
        if(gameOn && totalPlayers === 0) {
            name = $(".playerNameInput").val().trim();
            allUsers.child(playerKey).update({
                name: name,
                nameAdded: true,
                firstEntry: true,
            });
        } else if (gameOn && totalPlayers === 1) {
            name = $(".playerNameInput").val().trim();
            allUsers.child(playerKey).update({
                name: name,
                nameAdded: true,
            });
        }
    },
    createGameRoom: function(){ // This function creates a new game room.
        makeRoom = allGameRooms.push({ //Create a push that sends all game state data for this game room to Firebase.
            gameRoomId: "",
            startScreen: true,
            gameOn: false,
            playerReady: false,
            opponentReady: false,
            gameOver: false,
            player1Id: "",
            player1Choice: "",
            player1Chose: false,
            player2Id: "",
            player2Choice: "",
            player2Chose: false,
            clockRunning: false,
        })
        myGameRoom = makeRoom.key; //Grab the unique key of the game room's push.
        pushRoomId(); //Call the function that will now use the key that was just grabbed.
        function pushRoomId(){
            allGameRooms.child(myGameRoom).update({ // Target the game room we just created and then update its gameRoom Id property with its key.
                gameRoomId: myGameRoom, 
            })
            currentEmptyRoom.set({ //If there are no old Empty Room Ids, establish the empty key.
                emptyRoomId: "",
            })
            currentEmptyRoom.update({ //Update the key with the current room. 
                emptyRoomId: myGameRoom,
            })
        }
    },
    kickPlayer: function(){
        if(allUsers.child(playerKey).playerNumber === 1){
            allGameRooms.child(myGameRoom).update({
                player1Id: "",
            })
        } else{
            if (allUsers.child(playerKey).playerNumber === 2){
                allGameRooms.child(myGameRoom).update({
                    player2Id: "",
                })
            } 
        }
    },
    createNewPlayer: function(){ //This function creates a new player.
        thisPlayer = allUsers.push({ //create and capture a push to Firebase with the new player data.
            name: "",
            wins: 0,
            loses: 0,
            playerPick: "",
            playerNumber: 0,
            nameAdded: false,
            connected: true,
            firstEntry: false,
            playerReady: false,
            playerChoiceMade: false,
            hasOpponent: false,
            opponentId: "",
            gameRoomId: "",
        });
        thisPlayer.onDisconnect().remove(); //If this player disconnects, remove them from Firebase.
        playerKey = thisPlayer.key; //Grab the key of the push we just made.
        userTicker++ //Increment the User Ticker
        deepUserNum.update({ //Send the new value up to the Firebase user counter.
            userTicker: userTicker
        })
    },
    closeEmptyRooms: function(){
        const allRooms = allGameRooms.orderByKey();
        allRooms.once("value")
        .then(function(snapshot){
            snapshot.forEach(function(childSnap){
                let childProps = childSnap.val();
                if (childProps.player1Id === "" && childProps.player2Id === ""){
                    allGameRooms.child(childProps.gameRoomId).remove();
                }
            })             
        })
    }
};

//Constructors and Prototypes 
function sound(src) { //This makes the sound objects that are used when cards are made.
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 

//Click Events
$(".pNameBtn").click( function(event){ //When the player clicks the button to submit their display-name.
    event.preventDefault();

});

$(".startPlayBtn").click( function(event){//When the Player hits the start screen polay button.
    event.preventDefault();
    gameOn = true;
    gameFunctions.userConnect();
});

$(".rpsSelectopn").click( function(event){//When the player selects either Rock, Paper or Scissors by clicking on them.
    event.preventDefault();

});

$(".playAgainBtn").click( function(event){//When the player clicks the Play Again Button.
    event.preventDefault();

});

$(".sayBtn").click( function(event){//When the Player submits text to the chat.
    event.preventDefault();

});

//Call database Listeners
gameFunctions.firebaseListeners();




//My JS Ends beyond this point.
});