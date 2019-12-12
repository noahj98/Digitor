import getIsLoggedIn, { getInfo } from "./account_logic.js";

export default function makeHeader() {
    let str =  `<nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="index.html">Digitor</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="index.html">Home<span class="sr-only">(current)</span></a>
                            </li>`;
    if (getIsLoggedIn() === true) {
        if (getInfo()[3]=="false"){
            str += `
            <li class="nav-item active">
            <a class="nav-link" href="html/create_chat.html">New Chat <span class="sr-only">(current)</span></a>
            </li>`;
        }
        str +=`<li class="nav-item active">
        <a class="nav-link" href="html/chats.html">Current Chats <span class="sr-only">(current)</span></a>
        </li>`;
    }
    str += `            </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item align-self-end">`
    if (getIsLoggedIn() === true)
        str += `                <a class="nav-link" href="html/login-logout.html">Logout</a>`;
    else
        str += `                <a class="nav-link" href="html/login-logout.html">Login</a>`;
    str += `                </li>
                        </ul>
                    </div>
                </nav>`;
    
    $("#digitor-header").append(str);
};