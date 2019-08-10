// Game State
    let readyCheck = false;
    let gameOn = false;

//Player State
    let playerName;
    let thisPlayerNumber;
    let thisPlayerChoice;
    let wins = 0;
    let losses = 0;
    let opponentName;
    let imReady = false;

//Player Firebase State
    // Player References
    let playerKey; // Establish a variable that hold's this player's profile's push key.
    let myDir = `/allUsers/${playerKey}`; //Establish a variable that holds this player's direct directory path on Firebase.
    const myDirRef = database.ref(myDir); // This variable can be used to directly reference this player's directory.

    //Player's Room References
    let myRoomKey; //Establish a variable that hold this player's game room's push key.
    let myRoom = database.ref(`allGameRooms/${myRoomKey}`); // Establish a variable that hold this player's room's direct directory path on Firebase.
    let myRoomRef = allGameRooms.child(`${myRoomKey}`);
    let roomFullRef = database.ref('/allGameRooms/' + myRoomKey);// + '/roomFull'