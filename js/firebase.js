// Initialize Firebase
    const config = {
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
    const connectedRef = database.ref(`.info/connected`); //This Variable refers directly to the information reference that tells us if we are connected or not.

//If no directories exist, create directories.
database.ref().once(`value`).then(function(snapshot){
    if(snapshot.val() === null){// || allUsers === null || allUsers === undefined){
        allUsers.push('Initial All Users Push to Directory');
        allGameRooms.push('Initial All Game Room Push to Directory')
    }
})