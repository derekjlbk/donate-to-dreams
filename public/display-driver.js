"use strict";

var total = 0;
var goal = 50000;
var buffer = [];

function setGoalUI() {

}

function setTotalUI() {

}

function setProgressBar() {

}


function displayDriver() {
    console.log("Display driver JS loading");

    firebase.database().ref("bids").on("child_added", function (snapshot) {
        buffer.push(snapshot.val())
    })

}