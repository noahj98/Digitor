import makeHeader from "./header.js";
import getIsLoggedIn from "./account_logic.js";

$(document).ready(() => {
    let isLoggedIn = getIsLoggedIn();
    makeHeader();

    if (isLoggedIn === true) {
        $("#digitor-body").append(`<div style="padding-top:5rem;padding-left:10rem;padding-right:10rem;"> <div class="alert alert-success text-center" role="alert">
        <h3>You have successfully logged in! You may now chat!</h3>
      </div></div>`);
        return;
    }
    $("#digitor-body").append(`<div style="padding-top:5rem;padding-left:10rem;padding-right:10rem;"> <div class="alert alert-danger text-center" role="alert">
    <h3>Please login or register to use Digitor</h3>
  </div></div>`);
})