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
    const connectedRef = database.ref(".info/connected");

//Global Variables
totalPlayers = 0;
intervalId = 0;

//Game Objects
gameObjects = {
    gameStates : {
        startScreen: true,
        gameOn: false,
        playerReady: false,
        opponentReady: false,
        gameOver: false,
        playerChoiceMade: false,
        opponentChoiceMade: false,
        clockRunning: false,
    },
    playerData : {
        name: "",
        id: "",
        wins: 0,
        loses: 0,
        playerPick: "",
    },
    opponentData : {
        name: "",
        id: "",
        opponentPick: "",
    },
};



//Game Functions
gameFunctions = {
    userConnect: function(){
        const displayName = gameObjects.playerData.name
        const newUser = database.ref('/allUsers');
        connectedRef.on("value", function(conSnap){
            if (conSnap.val()){
                const connected = newUser.push({
                    name: displayName,
                    id: "",
                    wins: 0,
                    loses: 0,
                    playerPick: "",
                })
                playerKey = connected.key;
                const newUserId = database.ref('/allUsers'+playerKey);
                connectedRef.on("value", function(conSnap){
                    if (conSnap.val()){
                        newUserId.push({
                            id: playerKey,
                        })
                    };
                connected.onDisconnect().remove();
                })
            }
        })
    },
    uploadPlayerData : function(){
        displayName = gameObjects.playerData.name
        playerKey = gameObjects.playerData.id
        database.ref('/allUsers/'+playerKey).push(displayName);
    },
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
    gameObjects.playerData.name = $(".playerNameInput").val().trim();
});

$(".startPlayBtn").click( function(event){//When the Player hits the start screen polay button.
    event.preventDefault();
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

//Database Listeners
dataRef.on('value', snapshot => {
    snap = (snapshot.val());
    console.log(snap);
});
allUsers.on("child_added", function(userSnap){
    player = userSnap.val();
    gameObjects.playerData.id = userSnap.key; 
    console.log(player);
});



//My JS Ends beyond this point.
});