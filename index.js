import makeHeader from "./header.js";
import getIsLoggedIn from "./account_logic.js";

$(document).ready(() => {
    let isLoggedIn = getIsLoggedIn();
    makeHeader();

    if (isLoggedIn !== true) {
        $("#digitor-body").append("<p>You are currently logged out!</p>");
        return;
    }
    $("#digitor-body").append("<p>You are currently logged in!</p>");
})