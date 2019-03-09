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
    let playerKey;
    const connectedRef = database.ref(".info/connected");

//Global Variables
userArray = [];
totalPlayers = 0;
let player1Name = $(".player1");
let player2Name = $(".player2");
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
    opponentData : {
        name: "",
        id: "",
        opponentPick: "",
    },
};



//Game Functions
gameFunctions = {
    firebaseListeners: function() {
        connectedRef.on("value", function(conSnap){
            if (conSnap.val()){
                const connected = allUsers.push({
                    name: "",
                    wins: 0,
                    loses: 0,
                    playerPick: "",
                    nameAdded: false,
                    playerReady: false,
                    playerChoiceMade: false,
                    hasOpponent: false,
                    opponentId: "",
                });
                connected.onDisconnect().remove();
                playerKey = connected.key;
            };
        });
        dataRef.on('value', snapshot => {
            snap = (snapshot.val());
        });
        allUsers.on("child_changed", function(snapshot) {
            player = snapshot.val();
            if(player.nameAdded === false){
                if(totalPlayers === 0) {
                    player1Name.text(player.name);
                    totalPlayers = 1;
                }
            } else {
                opponent = snapshot.val();
                if(opponent.nameAdded === false){
                    if(spotsFilled === 1){
                        player2Name.text(opponent.name);
                        totalPlayers = 2;
                    }
                }
            }
        });
    },
    userConnect: function(){
        if(gameOn && totalPlayers === 0) {
            name = $(".playerNameInput").val().trim();
            allUsers.child(playerKey).update({
                name: name,
                nameAdded: true,
            });
        } else if (gameOn && totalPlayers === 1) {
            name = $(".playerNameInput").val().trim();
            allUsers.child(playerKey).update({
                name: name,
                nameAdded: true,
            });
        }
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