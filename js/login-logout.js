import makeHeader from "./header.js";
import getIsLoggedIn from "./account_logic.js";
import { logout } from "./account_logic.js";
import loginMaker from "./login.js";

$(document).ready(() => {
    if (getIsLoggedIn()) {
        logout();
        window.location = '/index.html';
        return;
    }
    makeHeader();
    loginMaker();
})