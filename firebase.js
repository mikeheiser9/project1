// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBWMFUmEh_35EqJCjUixK9Fiy5idSa9XY4",
//     authDomain: "do-you-speak-jive.firebaseapp.com",
//     databaseURL: "https://do-you-speak-jive.firebaseio.com",
//     projectId: "do-you-speak-jive",
//     storageBucket: "do-you-speak-jive.appspot.com",
//     messagingSenderId: "1077343670184"
// };

firebase.initializeApp(config);
var dataRef = firebase.database();
// Initial Values
var name = "";
var age = 0;
var highScores = [];
var languageFB;
var artistFB;


// Capture Button Click
$("#add-user").on("click", function (event) {
    event.preventDefault();

    //take user to high score page

    name = $("#name-input").val().trim();
    age = $(".score").text().trim();
    languageFB = $("#current-artist").text();
    artistFB = $("#current-language").text();
    console.log(languageFB);

    // Code for the push
    dataRef.ref().push({
        name: name,
        age: age,
        languageFB: languageFB,
        artistFB: artistFB,
        
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    window.location.assign("highscores.html")
});

dataRef.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().age);
    


    // full list of items to the well
    $("#full-member-list").append("<div class='well'><span class='member-name'> " + childSnapshot.val().name +
        " </span><span class='member-age'> " + childSnapshot.val().age + " </span><span class='member-age'> " + childSnapshot.val().languageFB + " </span><span class='member-age'> " + childSnapshot.val().artistFB + " </span></div>");
        
    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

    // Change the HTML to reflect
    $("#name-display").text(snapshot.val().name);
    $("#age-display").text(snapshot.val().age);


    

});

dataRef.ref().once("value", function(snapshot) {

    // Then we console.log the value of snapshot
    snapshot.forEach(function (childSnapshot) {
        var nameKey = childSnapshot.key;
        var nameData = childSnapshot.val().name;
        var ageData= childSnapshot.val().age;
        var artistData = childSnapshot.val().artistFB;
        var languageData = childSnapshot.val().languageFB;

        var obj2 = {
            name: nameData,
            age: ageData,
            language: languageData,
            artist: artistData
        }
        highScores.push(obj2);
    })

console.log(highScores);
    for (i=0; i<highScores.length;i++) {
        var showScore = $("<div class='show-score'>")
        showScore.append(highScores[i].name+ " scored:  "+highScores[i].age+" points while playing the "+highScores[i].language+ " game on " +highScores[i].artist +" language")
        $(".high-score").append(showScore);
    }
})

var language = sessionStorage.getItem("language");
var artistChoice = sessionStorage.getItem("artist-name");







