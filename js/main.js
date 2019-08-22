$(document).ready(function(){    

//Establish the basic rules of rock, paper, scissors using an object.
const weapons = { //The idea to use an object to hold information on what beats what is based off of an answer by Federkun on Stack Overflow. Source - "https://stackoverflow.com/questions/53730900/more-efficient-choice-comparison-for-rock-paper-scissors"
    rock: {beats: 'scissors'},
    paper: {beats: 'rock'},
    scissors: {beats: 'paper'},
}

// intervalId = 0;

//Game Functions
gameFunctions = {

    // This function checks for the presence of the player's opponent. 
    // If they are their, the game proceeds to the next stage. 
    // If not, it notifies them that the game is waiting on an opponent.
    checkPlayerPresence: function(){
        allGameRooms.once('value', function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            p1Id = myroom.player1Id;
            p2Id = myroom.player2Id;
            if(p1Id !== '' && p2Id !== ''){
                fbFunctions.grabOpponentName();
            } else{
                instructTitle.text(`Welcome, ${playerName}!`)
                instructText.text('Waiting For an Opponent.'); 
    } }); },
    // --------------------------------------------------------

    // If the player hasn't yet noted that they are ready, note that they are ready.
    // Then, change the displayed elements to reveal the ready screen.
    readyCheck: function(){
        if(!readyCheck){
            readyCheck = true
            if(!introScreen.hasClass('buryIt')){
                introScreen.addClass('buryIt');
            }
            if(readyScreen.hasClass('buryIt')){
                readyScreen.removeClass('buryIt');
                readyTitle.text(`Are You Ready, ${playerName}?`);
            }
            if(chatRow.hasClass('buryIt')){
                chatRow.removeClass('buryIt');
            }
    } },
    // --------------------------------------------------------

    // If both players are ready, trigger the start of the game. 
    // If not, show the player that they are waiting on their opponent.
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

    // On game start, set the game state for the game to be on, then 
    // reveal the game elements.
    gameStart: function(){
        readyCheck = false;
        if(!gameOn){
            gameOn = true;
            if(!readyScreen.hasClass('buryIt')){
                readyScreen.addClass('buryIt');
            }
            if(!endScreen.hasClass('buryIt')){
                endScreen.addClass('buryIt');
            }
            if(gameOnScreen.hasClass('buryIt')){
                gameOnScreen.removeClass('buryIt')
                if(thisPlayerNumber === 1 && !player1Name.hasClass('protag')){
                    player1Name.text(`${playerName}`).addClass('protag');
                    player2Name.text(`${opponentName}`).addClass('antag');
                }
                if(thisPlayerNumber === 2 && !player2Name.hasClass('protag')){
                    player2Name.text(`${playerName}`).addClass('protag');
                    player1Name.text(`${opponentName}`).addClass('antag');
                }
                subTitle.addClass('buryIt')
                winLossDiv.removeClass('buryIt')
                anouncement.text(`Round ${roundNum}!`);
            }
            if(rpsButtons.hasClass('buryIt')){
                rpsButtons.removeClass('buryIt');
            }
    } },
    // --------------------------------------------------------

    // One the player has made their choice, check to see if the other player has also made their choice. 
    // If so, compare the choices and update the firebase database with the results.
    checkPlayerChoice: function(){
        allGameRooms.once('value', function(snap) {
            roomsSnapshot = snap.child(`${myRoomKey}`);
            const myroom = roomsSnapshot.val();
            const p1Choice = myroom.player1Choice;
            const p2Choice = myroom.player2Choice;
            if(p1Choice !== '' && p2Choice !== ''){
                if(p1Choice === p2Choice){ // If the player choices are the same...
                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 
                        roundResult: 'tie', //...to show that the result is a tie.
                        whatChanged: 'roundResult', // We also notify the room of the change that has just occured.
                    })
                } else if(weapons[p1Choice].beats === p2Choice){ // But, if player 1's choice beats player 2's choice...
                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 
                        roundResult: 'p1Wins', //...to show that player 1 wins.
                        whatChanged: 'roundResult', // We also notify the room of the change that has just occured.
                    })
                } else { // But if it's not a tie, and player 1's choice doesn't beat player 2's choice...
                    allGameRooms.child(myRoomKey).update({ // ...we update the game room information... 
                        roundResult: 'p2Wins', //...to show that player2 wins.
                        whatChanged: 'roundResult', // We also notify the room of the change that has just occured.
                    })
                }
            } else {
                //Notify this player that they're waiting on the opponent's choice.
            }
        });
    },
    // --------------------------------------------------------

    // Check the firebase for the results of the game and depending on the results, 
    // display the results as personalized messages to the winner and loser. 
    displayResults: function(){
        allGameRooms.once('value', function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`).val();
            const winner = roomsSnapshot.roundResult;
            const resetReady = {roundResult: ''};
            if (thisPlayerNumber === 1){
                Object.assign(resetReady, {player1Ready: ''});
            } else if (thisPlayerNumber === 2) {
                Object.assign(resetReady, {player2Ready: ''});
            }
            readyCheck = false;
            imReady = false;
            switch(winner) {
                case 'tie':
                    allGameRooms.child(myRoomKey).update(resetReady);
                    gameFunctions.itsATie();
                    break;
                case 'p1Wins':
                    allGameRooms.child(myRoomKey).update(resetReady);
                    gameFunctions.player1Wins();
                    break;
                case 'p2Wins':
                    allGameRooms.child(myRoomKey).update(resetReady);
                    gameFunctions.player2Wins();
                    break;
                default:
                    break;
            }
            if(!gameOnScreen.hasClass('buryIt')){
                gameOnScreen.addClass('buryIt')
            }
            if(endScreen.hasClass('buryIt')){
                endScreen.removeClass('buryIt')
            }

        });
    },
    // --------------------------------------------------------

    // When the results of the game are a tie.
    itsATie: function(){
        anouncement.text(`It's a Tie!`)
    },
    // --------------------------------------------------------

    // When the firebase database is updated with a message from player 1...
    handlePlayer1Message: function(){
        allGameRooms.once('value', function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`).val();

        });
    },
    // --------------------------------------------------------

    // When the firebase database is updated with a message from player 2...
    handlePlayer2Message: function(){
        allGameRooms.once('value', function(snap) {
            const roomsSnapshot = snap.child(`${myRoomKey}`).val();
        });
    },
    // --------------------------------------------------------

    // Handle a player 1 win.
    player1Wins: function(){
        if(thisPlayerNumber === 1){
            anouncement.text(`You Win!`)
            endTitle.text(`Congratulations, ${playerName}!`)
            ++wins
            console.log(wins)
            myWins.text(`${wins}`)
            allUsers.child(playerKey).update({
                wins: wins,
            });
        } else if (thisPlayerNumber === 2){
            anouncement.text(`${opponentName} Wins!`)
            endTitle.text(`Better luck next time, ${playerName}!`)
            losses++
            console.log(losses)
            myLosses.text(`${losses}`)
            allUsers.child(playerKey).update({
                losses: losses,
            });
        }
    },
    // --------------------------------------------------------
    
    // Handle a player 2 win.
    player2Wins: function(){
        if(thisPlayerNumber === 2){
            anouncement.text(`You Win!`)
            endTitle.text(`Congratulations, ${playerName}!`)
            ++wins
            allUsers.child(playerKey).update({
                wins: wins,
            });
            myWins.text(`${wins}`)
        } else if (thisPlayerNumber === 1){
            anouncement.text(`${opponentName} Wins!`)
            endTitle.text(`Better luck next time, ${playerName}!`)
            losses++
            allUsers.child(playerKey).update({
                losses: losses,
            });
            myLosses.text(`${losses}`)
        }
    },
    // --------------------------------------------------------

    resetGameState: function(){
        resetState = { // ...we update the game room information... 
            whatChanged: 'nothing', 
            player1Choice: '',
            player2Choice: '',
            roundResult: '',
        }
        allGameRooms.child(myRoomKey).update(resetState);
        gameOn = false;
        roundScored = false;
        roundNum++
        console.log(roundNum);
        anouncement.text(`Round ${roundNum}!`);
    },
    // --------------------------------------------------------
};

//If there are empty rooms still in the directory, delete them before proceeding
fbFunctions.closeEmptyRooms();

//Call database Listeners
fbFunctions.firebaseListeners();

//My JS Ends beyond this point.
});