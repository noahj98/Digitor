import makeHeader from "./header.js";
import logout from "./account_logic.js";

$(document).ready(() => {
    logout();
    makeHeader();

    $("#digitor-body").append("<p>Successfully logged out</p>");
})