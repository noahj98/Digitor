import getIsLoggedIn from "./account_logic.js";

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
    if (getIsLoggedIn() === true)
        str += `            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Chat
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="create_chat.html">New Chat</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="chats.html">Current Chats</a>
                                </div>
                            </li>`;
    str += `            </ul>
                        <ul class="navbar-nav">
                            <li class="nav-item align-self-end">`
    if (getIsLoggedIn() === true)
        str += `                <a class="nav-link" href="logout.html">Logout</a>`;
    else
        str += `                <a class="nav-link" href="login.html">Login</a>`;
    str += `                </li>
                        </ul>
                    </div>
                </nav>`;
    
    $("#digitor-header").append(str);
};