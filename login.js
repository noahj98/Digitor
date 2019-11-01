import makeHeader from "./header.js";
import attemptLogin from "./account_logic.js";

$(document).ready(() => {
    attemptLogin();
    makeHeader();

    $("#digitor-body").append("<p>Login successful</p>");
})