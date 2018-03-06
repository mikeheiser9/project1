// Initialize Firebase
var config = {
    apiKey: "AIzaSyBWMFUmEh_35EqJCjUixK9Fiy5idSa9XY4",
    authDomain: "do-you-speak-jive.firebaseapp.com",
    databaseURL: "https://do-you-speak-jive.firebaseio.com",
    projectId: "do-you-speak-jive",
    storageBucket: "do-you-speak-jive.appspot.com",
    messagingSenderId: "1077343670184"
};

firebase.initializeApp(config);
var dataRef = firebase.database();
// Initial Values
var name = "";
var age = 0;
// var score=""

score = sessionStorage.getItem("score")

// Capture Button Click
$("#add-user").on("click", function (event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    age = $("#age-input").val().trim();

    // Code for the push
    dataRef.ref().push({
        name: name,
        age: age,
        // score:score,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

dataRef.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().age);
    // console.log(childSnapshot.val().score);


    // full list of items to the well
    $("#full-member-list").append("<div class='well'><span class='member-name'> " + childSnapshot.val().name +
        " </span><span class='member-age'> " + childSnapshot.val().age + " </span></div>");
        // " </span><span class='member-score'> " + childSnapshot.val().score + " </span></div>");
        


    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

    // Change the HTML to reflect
    $("#name-display").text(snapshot.val().name);
    $("#age-display").text(snapshot.val().age);
    // $("#score-display").text(snapshot.val().score);

});


