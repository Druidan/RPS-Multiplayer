$(document).ready(function(){ 

    fbFunctions = {
        firebaseListeners: function() {
            // -----------------------------------
    
            connectedRef.on('value', function(conSnap){ 
                console.log("I'm Connected!")
            }, function(errorObject) {
                console.log(`The read failed: ${errorObject.code}`);
            });
    
            // -----------------------------------
    
            allGameRooms.on('value', function(snap) {
                if (myRoomKey){
                    const roomsSnapshot = snap.child(`${myRoomKey}`).val();
                    const theChange = roomsSnapshot.whatChanged;
        
                    switch(theChange){
                        case 'nothing':
                            break;
        
                        case 'playerPresence':
                            fbFunctions.resetWhatChanged();
                            gameFunctions.checkPlayerPresence();
                            break;
        
                        case 'playerReady':
                            fbFunctions.resetWhatChanged();
                            gameFunctions.checkPlayerReady();
                            break;
        
                        case 'player1message':
                            fbFunctions.resetWhatChanged();
                            gameFunctions.handlePlayer1Message();
                            break;
        
                        case 'player2message':
                            fbFunctions.resetWhatChanged();
                            gameFunctions.handlePlayer2Message();
                            break;
        
                        case 'playerChoice':
                            fbFunctions.resetWhatChanged();
                            gameFunctions.checkPlayerChoice();
                            break;
        
                        case 'roundResult':
                            fbFunctions.resetWhatChanged();
                            if(roundScored === false){
                                roundScored = true;
                                gameFunctions.displayResults();
                            }
                            break;

                        default:
                            break;
                    }
                }
            });
        },
        // --------------------------------------------------------

        createGameRoom: function(){ // This function creates a new game room.
            makeRoom = allGameRooms.push({ //Create a push that sends all game state data for this game room to Firebase.
                whatChanged: 'nothing',
                gameRoomId: '',
                readyCheck: false,
                gameOn: false,
                endScreen: false,
                playerReady: false,
                opponentReady: false,
                player1Id: '',
                player1Ready: '',
                player1Choice: '',
                player2Id: '',
                player2Ready: '',
                player2Choice: '',
                roundResult: '',
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
                myId: '',
                wins: 0,
                losses: 0,
                playerPick: '',
                playerNumber: thisPlayerNumber,
                connected: true,
                gameRoomId: myRoomKey,
            });
            playerKey = thisPlayer.key; //Grab the key of the push we just made.
            allUsers.child(playerKey).update({
                myId: playerKey,
            });
            if(thisPlayerNumber === 1){
                allGameRooms.child(myRoomKey).update({
                    player1Id: playerKey,
                    whatChanged: 'playerPresence',
                });
                allGameRooms.child(myRoomKey).onDisconnect().update({
                    roomFull: false,
                    player1Id: '',
                    whatChanged: 'playerPresence',
                });
            } else if(thisPlayerNumber === 2){
                allGameRooms.child(myRoomKey).update({
                    player2Id: playerKey,
                    whatChanged: 'playerPresence',
                });
                allGameRooms.child(myRoomKey).onDisconnect().update({
                    roomFull: false,
                    player2Id: '',
                    whatChanged: 'playerPresence',
                });
            };
            thisPlayer.onDisconnect().remove(); //If this player disconnects, remove them from Firebase.
        },
        // --------------------------------------------------------
    
        closeEmptyRooms: function(){
            allGameRooms.once('value').then(function(snapshot) {
                eachRoom = snapshot.val();
                for(room in eachRoom){
                    const currentRoom = database.ref(`/allGameRooms/${room}`)
                    currentRoom.once('value').then(function(rSnapshot){
                        r = rSnapshot.val()
                        if(r.player1Id === '' && r.player2Id === ''){
                            allGameRooms.child(room).remove();
        } }) } }) },
        // --------------------------------------------------------
    
        resetWhatChanged: function(){
            allGameRooms.child(myRoomKey).update({
                whatChanged: 'nothing',
        }); },
        // --------------------------------------------------------

        grabOpponentName: function(){

            if(thisPlayerNumber === 1){
                allGameRooms.once('value', function(snap) {
                    const roomsSnapshot = snap.child(`${myRoomKey}`);
                    const myroom = roomsSnapshot.val();
                    const opponentId = myroom.player2Id;
                    allUsers.once('value', function(snap2){
                        const opponent = snap2.child(`${opponentId}`);
                        const trueOpponent = opponent.val()
                        opponentName = trueOpponent.name;
                        gameFunctions.readyCheck();
    
            }) }) } else if(thisPlayerNumber === 2){
    
                allGameRooms.once('value', function(snap) {
                    const roomsSnapshot = snap.child(`${myRoomKey}`);
                    const myroom = roomsSnapshot.val();
                    const opponentId = myroom.player1Id;
                    allUsers.once('value', function(snap2){
                        const opponent = snap2.child(`${opponentId}`);
                        const trueOpponent = opponent.val()
                        opponentName = trueOpponent.name;
                        gameFunctions.readyCheck();
            }) }) } },
        // --------------------------------------------------------
    

    };

})