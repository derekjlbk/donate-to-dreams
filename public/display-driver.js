"use strict";

var total = 0;
var goal = 10000;

function formatCurrencyString(value) {
    return (value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').split(".")[0]
}

function setGoalUI() {
    var ratio = total / goal
    if (ratio <= 1) {
        var fill = (1 - ratio) * 100
        $(".progress-bar-fill").css("height", fill + "%")
    } else {
        $(".progress-bar-fill").css("height", "100%")
    }
}

function setTotalUI() {
    $("#total-ui").html("$" + formatCurrencyString(total))
}

function setBidUI(position, info) {
    $("#bidder-name-" + position).html(info.name)

    if (info.amount !== "") {
        var valueStr = info.amount.replace("$", "")
        $("#bidder-amount-" + position).html("$" + valueStr)
    } else {
        $("#bidder-amount-" + position).html("")
    }
    
}

function getBidInfoFromPosition(position) {
    return {
        name: $("#bidder-name-" + position).html(),
        amount: $("#bidder-amount-" + position).html()
    }
}

function triggerDisplayModal(info) {
    $("#display-name").html(info.name)
    $("#display-amount").html("$" + formatCurrencyString(Number(info.amount)))
    $("#display-modal").modal("show")
    var delay = 1000
    if (info.amount == "1000") {
        delay = 5000
    } else if (info.amount == "500" || info.amount == "100") {
        delay = 2000
    }

    setTimeout(function () {
        $("#display-modal").modal("hide")
    }, delay)
}

function displayDriver() {
    console.log("Display driver JS loading...");

    firebase.database().ref("bids").on("child_added", function (snapshot) {
        var data = snapshot.val()
        var info = {
            name: data.name,
            amount: data.amount
        }

        triggerDisplayModal(info)

        setTimeout(function () {
            setBidUI(5, getBidInfoFromPosition(4))
            setBidUI(4, getBidInfoFromPosition(3))
            setBidUI(3, getBidInfoFromPosition(2))
            setBidUI(2, getBidInfoFromPosition(1))
            setBidUI(1, { name: info.name, amount: formatCurrencyString(Number(info.amount)) })

            total += Number(info.amount)
            setTotalUI()
            setGoalUI()
        }, 1000)
        
    })

    $("#goal-amount").html("$" + formatCurrencyString(goal))

    console.log("Display driver JS finished loading.")
}