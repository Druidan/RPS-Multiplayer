$(document).ready(function(){    

//Establish the basic rules of rock, paper, scissors using an object.
const weapons = { //The idea to use an object to hold information on what beats what is based off of an answer by Federkun on Stack Overflow. Source - "https://stackoverflow.com/questions/53730900/more-efficient-choice-comparison-for-rock-paper-scissors"
    rock: {beats: 'scissors'},
    paper: {beats: 'rock'},
    scissors: {beats: 'paper'},
}

// HTML Variables
const titleDiv = $('.titleDiv');
const winLossDiv = $('.win-loss-div');
const anouncement = $('.win-loss-anouncement');
const introScreen = $('.intro-screen');
const readyScreen = $('.ready-screen');
const gameOnScreen = $('.gameOn-screen');
const rpsButtons = $('.rpsButtonRow');
const endScreen = $('.end-screen');
const myWins = $('.winsDisplay');
const myLosses = $('.lossesDisplay');
const chatRow = $('.chatRow');
const player1Name = $('.player1');
const player2Name = $('.player2');

// intervalId = 0;

//Game Functions
gameFunctions = {
    // firebaseListeners: function() {
    //     // -----------------------------------

    //     connectedRef.on('value', function(conSnap){ 
    //         console.log("I'm Connected!")
    //     }, function(errorObject) {
    //         console.log(`The read failed: ${errorObject.code}`);
    //     });

    //     // -----------------------------------

    //     allGameRooms.on('value', function(snap) {
    //         const roomsSnapshot = snap.child(`${myRoomKey}`).val();
    //         const theChange = roomsSnapshot.whatChanged;

    //         switch(theChange){
    //             case 'nothing':
    //                 break;

    //             case 'playerPresence':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.checkPlayerPresence();
    //                 break;

    //             case 'playerReady':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.checkPlayerReady();
    //                 break;

    //             case 'player1message':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.handlePlayer1Message();
    //                 break;

    //             case 'player2message':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.handlePlayer2Message();
    //                 break;

    //             case 'playerChoice':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.checkPlayerChoice();
    //                 break;

    //             case 'roundResult':
    //                 gameFunctions.resetWhatChanged();
    //                 gameFunctions.displayResults();
    //                 break;
    //         }
    //     });
    // },
    // // --------------------------------------------------------

    // createGameRoom: function(){ // This function creates a new game room.
    //     makeRoom = allGameRooms.push({ //Create a push that sends all game state data for this game room to Firebase.
    //         whatChanged: 'nothing',
    //         gameRoomId: '',
    //         // roomFull: false,
    //         readyCheck: false,
    //         gameOn: false,
    //         endScreen: false,
    //         playerReady: false,
    //         opponentReady: false,
    //         player1Id: '',
    //         player1Ready: '',
    //         player1Choice: '',
    //         player2Id: '',
    //         player2Ready: '',
    //         player2Choice: '',
    //         roundResult: '',
    //         // clockRunning: false,
    //     })
    //     myRoomKey = makeRoom.key; //Grab the unique key of the game room's push.
    //     pushRoomId(); //Call the function that will now use the key that was just grabbed.
    //     function pushRoomId(){
    //         allGameRooms.child(myRoomKey).update({ // Target the game room we just created and then update its gameRoom Id property with its key.
    //             gameRoomId: myRoomKey, 
    //         });
    //     }
    // },
    // // --------------------------------------------------------

    // createNewPlayer: function(){ //This function creates a new player.
    //     thisPlayer = allUsers.push({ //create and capture a push to Firebase with the new player data.
    //         name: playerName,
    //         myId: '',
    //         wins: 0,
    //         losses: 0,
    //         playerPick: '',
    //         playerNumber: thisPlayerNumber,
    //         connected: true,
    //         gameRoomId: myRoomKey,
    //     });
    //     playerKey = thisPlayer.key; //Grab the key of the push we just made.
    //     allUsers.child(playerKey).update({
    //         myId: playerKey,
    //     });
    //     if(thisPlayerNumber === 1){
    //         allGameRooms.child(myRoomKey).update({
    //             player1Id: playerKey,
    //             whatChanged: 'playerPresence',
    //         });
    //         allGameRooms.child(myRoomKey).onDisconnect().update({
    //             roomFull: false,
    //             player1Id: '',
    //             whatChanged: 'playerPresence',
    //         });
    //     } else if(thisPlayerNumber === 2){
    //         allGameRooms.child(myRoomKey).update({
    //             player2Id: playerKey,
    //             whatChanged: 'playerPresence',
    //         });
    //         allGameRooms.child(myRoomKey).onDisconnect().update({
    //             roomFull: false,
    //             player2Id: '',
    //             whatChanged: 'playerPresence',
    //         });
    //     };
    //     thisPlayer.onDisconnect().remove(); //If this player disconnects, remove them from Firebase.
    // },
    // // --------------------------------------------------------

    // closeEmptyRooms: function(){
    //     allGameRooms.once('value').then(function(snapshot) {
    //         eachRoom = snapshot.val();
    //         for(room in eachRoom){
    //             const currentRoom = database.ref(`/allGameRooms/${room}`)
    //             currentRoom.once('value').then(function(rSnapshot){
    //                 r = rSnapshot.val()
    //                 if(r.player1Id === '' && r.player2Id === ''){
    //                     allGameRooms.child(room).remove();
    // } }) } }) },
    // // --------------------------------------------------------

    // resetWhatChanged: function(){
    //     allGameRooms.child(myRoomKey).update({
    //         whatChanged: 'nothing',
    // }); },
    // --------------------------------------------------------

    checkPlayerPresence: function(){
        allGameRooms.once('value', function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            p1Id = myroom.player1Id;
            p2Id = myroom.player2Id;
            if(p1Id !== '' && p2Id !== ''){
                fbFunctions.grabOpponentName();
            } else{
                $('.instructionText').text('Waiting For an Opponent.'); 
    } }); },
    // --------------------------------------------------------

    // grabOpponentName: function(){

    //     if(thisPlayerNumber === 1){
    //         allGameRooms.once('value', function(snap) {
    //             const roomsSnapshot = snap.child(`${myRoomKey}`);
    //             const myroom = roomsSnapshot.val();
    //             const opponentId = myroom.player2Id;
    //             allUsers.once('value', function(snap2){
    //                 const opponent = snap2.child(`${opponentId}`);
    //                 const trueOpponent = opponent.val()
    //                 opponentName = trueOpponent.name;
    //                 gameFunctions.readyCheck();

    //     }) }) } else if(thisPlayerNumber === 2){

    //         allGameRooms.once('value', function(snap) {
    //             const roomsSnapshot = snap.child(`${myRoomKey}`);
    //             const myroom = roomsSnapshot.val();
    //             const opponentId = myroom.player1Id;
    //             allUsers.once('value', function(snap2){
    //                 const opponent = snap2.child(`${opponentId}`);
    //                 const trueOpponent = opponent.val()
    //                 opponentName = trueOpponent.name;
    //                 gameFunctions.readyCheck();
    //     }) }) } },
    // // --------------------------------------------------------

    readyCheck: function(){
        if(!readyCheck){
            readyCheck = true
            if(!introScreen.hasClass('buryIt')){
                introScreen.addClass('buryIt');
            }
            if(readyScreen.hasClass('buryIt')){
                readyScreen.removeClass('buryIt')
            }
            if(chatRow.hasClass('buryIt')){
                chatRow.removeClass('buryIt')
            }
    } },
    // --------------------------------------------------------

    checkPlayerReady: function(){
        allGameRooms.once('value', function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            p1Ready = myroom.player1Ready;
            p2Ready = myroom.player2Ready;
            if(p1Ready && p2Ready){
                gameFunctions.gameStart();
            } else if(imReady) {
                $('.readyText').text(`Waiting For ${opponentName}.`); 
            }
        });
    },
    // --------------------------------------------------------

    gameStart: function(){
        readyCheck = false;
        if(!gameOn){
            gameOn = true;
            if(!readyScreen.hasClass('buryIt')){
                readyScreen.addClass('buryIt')
            }
            if(gameOnScreen.hasClass('buryIt')){
                gameOnScreen.removeClass('buryIt')
                if(thisPlayerNumber === 1){
                    player1Name.text(`${playerName}`)
                    player2Name.text(`${opponentName}`)
                }
                if(thisPlayerNumber === 2){
                    player2Name.text(`${playerName}`)
                    player1Name.text(`${opponentName}`)
                }
            }
            if(rpsButtons.hasClass('buryIt')){
                rpsButtons.removeClass('buryIt')
            }
    } },
    // --------------------------------------------------------

    checkPlayerChoice: function(){
        allGameRooms.once('value', function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            const p1Choice = myroom.player1Choice;
            const p2Choice = myroom.player2Choice;
            if(p1Choice !== '' && p2Choice !== ''){
                if(p1Choice === p2Choice){ //If the player choices are the same...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: 'tie', //...to show that the result is a tie.
            
                        whatChanged: 'roundResult', //We also notify the room of the change that has just occured.
                    })
                } else if(weapons[p1Choice].beats === p2Choice){ // But, if player 1's choice beats player 2's choice...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: 'p1Wins', //...to show that player 1 wins.
            
                        whatChanged: 'roundResult', //We also notify the room of the change that has just occured.
                    })

                } else { //But if it's not a tie, and player 1's choice doesn't beat player 2's choice...

                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 

                        roundResult: 'p2Wins', //...to show that player2 wins.
            
                        whatChanged: 'roundResult', //We also notify the room of the change that has just occured.
                    })
                }
            } else {
                //Notify this player that they're waiting on the opponent's choice.
            }
        });
    },
    // --------------------------------------------------------

    displayResults: function(){
        allGameRooms.once('value', function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            const winner = myroom.roundResult;
            switch(winner) {
                case 'tie':
                    gameFunctions.itsATie();
                    break;
                case 'p1Wins':
                    gameFunctions.player1Wins();
                    break;
                case 'p2Wins':
                    gameFunctions.player2Wins();
                    break;
            }
            if(!gameOnScreen.hasClass('buryIt')){
                gameOnScreen.addClass('buryIt')
                titleDiv.addClass('buryIt')
            }
            if(winLossDiv.hasClass('buryIt')){
                winLossDiv.removeClass('buryIt')
                endScreen.removeClass('buryIt')
            }
        });
    },
    // --------------------------------------------------------

    handlePlayer1Message: function(){
        allGameRooms.once('value', function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
        });
    },
    // --------------------------------------------------------

    handlePlayer2Message: function(){
        allGameRooms.once('value', function(snap) {
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
fbFunctions.closeEmptyRooms();

//Call database Listeners
fbFunctions.firebaseListeners();

//My JS Ends beyond this point.
});