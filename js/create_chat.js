import getIsLoggedIn from "./account_logic.js";
import makeHeader from "./header.js";
import { getInfo } from "./account_logic.js";
let other_uid;

$(document).ready(async () => {
    makeHeader();
    //must be logged in
    if (!getIsLoggedIn()) {
        $('#digitor-body').append('<p>You must be logged in to create a new chat.</p>');
        return;
    }
    const result = (await axios({
        method : 'put',
        url : 'http://localhost:3000/getNoHistory',
        data : {
            'uid' : getInfo()[2],
            'isMentor' : getInfo()[3]
        }
    }))['data']['data'];

    $("#digitor-body").append(`<div id="all-chats" style="padding-left:25rem;padding-right:25rem;padding-top:3rem"></div`);

    for (let i = 0; i < result.length; i++) {
        let curr  = result[i];
        let fname = curr['fname'];
        let lname = curr['lname'];
        let email = curr['email'];
        let major = curr['major'];
        let uid   = curr['uid'];
        let year;
        switch (curr['year']) {
            case "0": year = 'freshman'; break;
            case "1": year = 'sophomore'; break;
            case "2": year = 'junior'; break;
            case "3": year = 'senior'; break;
            default: year = 'junior'
        }
        $('#all-chats').append(`
        <div style="padding-bottom:1rem">
        <div id="chat-card-`+uid+`" class="card text-center">
            <div class="card-header">
                `+ fname + ` ` + lname +`
            </div>
            <div class="card-body">
                <h5 class="card-title">` + major + ` major</h5>
                <p class="card-text">`+fname+` is a `+year+`</p>
                <div class="btn-group">
                    <a href="#" id="chat-btn-`+uid+`" class="btn btn-primary chat-btn">Chat Now</a>
                </div>
            </div>`+(true?`
            <div class="card-footer text-muted">
                `+email+`
            </div>`:``)+`
        </div></div>
        `);
    }

    $('.chat-btn').on('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        let uid = e.target.id.substr(9, e.target.id.length);
        other_uid = uid;
        $('#digitor-body').empty();
        putChats();
    });
});


function putChats() {
    let textArea = `
    <div style="padding-left:20rem;padding-right:20rem;padding-top:3rem">
    <form>
    <div class="form-group" style="padding-right:3.3rem">
        <label>Enter a message to send:</label>
            <textarea class="form-control" id="digitor-message-to-send" rows="3"></textarea>
        </div>
        <button id="digitor-send-message" type="button" class="btn btn-primary">Send Message</button>
    </form></div>`;
    $("#digitor-body").append(textArea);
    $("#digitor-send-message").on("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        let msg = $("#digitor-message-to-send")[0].value;
        console.log(msg);
        if (msg == "") return;
        let mentor_uid = getInfo()[3] ? getInfo()[2]:other_uid;
        let user_uid = getInfo()[3]?other_uid:getInfo()[2];

        axios({
            method: 'put',
            url: 'http://localhost:3000/sendMessage',
            data: {
                'sender_uid':getInfo()[2],
                'mentor_uid':mentor_uid,
                'user_uid':user_uid,
                'message':msg
            }
        });

        $("#curr_chat").prepend(`
            <li class="list-group-item card-text text-right"
            style="padding-left:3rem">`+msg+`
            <br>
                <small class="text-muted">`+(new Date()).toDateString()+`</small>
            </li>
        `);
    });

    //chats is an array
    $("#digitor-body").append(`
    <div style="padding-left:20rem;padding-right:20rem;padding-top:3rem">
    <div class="card" style="width: 36rem;">
        <div class="card-body">
            <ul id="curr_chat" class="list-group list-group-flush"></ul>
        </div>
    </div>
    </div>
    `);
};