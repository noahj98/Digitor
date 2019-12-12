import getIsLoggedIn from "./account_logic.js";
import { getInfo } from "./account_logic.js";
import makeHeader from "./header.js";

let other_uid;

$(document).ready(async () => {
    makeHeader();
    if (!getIsLoggedIn()) {
        $('#digitor-body').append('<p>You must be logged in to view chats.</p>');
        return;
    }
    $("#digitor-body").append(`<div id="all-chats" style="padding-left:25rem;padding-right:25rem;padding-top:3rem"></div`);
    let credentials = getInfo();
    const result = (await axios({
        method: 'put',
        url: 'http://localhost:3000/getChats',
        data: {
            'email' : credentials[0],
            'password' : credentials[1],
        }
    })).data;
    for (let idx in result) {
        let msg = result[idx];

        $('#all-chats').append(`
        <div style="padding-bottom:1rem">
        <div id="chat-card-`+msg['uid']+`" class="card text-center">
            <div class="card-header">
                `+msg["fname"] + ` ` + msg["lname"] +`
            </div>
            <div class="card-body">
                <h5 class="card-title">` + msg["major"] + ` major</h5>
                <p class="card-text">You and `+msg['fname']+` have messaged each other ` + msg['numMsgs'] + ` times!</p>
                <div class="btn-group">
                    <a href="#" id="chat-btn-`+msg['uid']+`" class="btn btn-primary chat-btn">Chat Now</a>
                    <a href="#" id="delete-chat-btn-`+msg['uid']+`" class="btn btn-primary delete-chat-btn btn-danger">Delete Chat</a>
                </div>
            </div>`+(false?`
            <div class="card-footer text-muted">
                Last message: `+(msg['ltime'] === undefined ? 'never' : (Math.floor((msg['ltime']-now)/1000/60/60/24) + ' days ago'))+`
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
        //get chat history from server
        
        const CHAT_HISTORY = (await axios({
            method: 'put',
            url: 'http://localhost:3000/getChat',
            data: {
                'uid1':getInfo()[2],
                'uid2':uid
            }
        }))['data']['data'];

        putChats(CHAT_HISTORY);
    });
    $('.delete-chat-btn').on('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let uid = e.target.id.substr(16, e.target.id.length);

        //delete from server
        let theData = {
            'uid1':uid,
            'uid2':getInfo()[2]
        };
        // console.log(theData);
        axios({
            method: 'put',
            url: 'http://localhost:3000/deleteChat',
            data: theData
        });

        $('#chat-card-'+uid).remove();
    });
});

function putChats(chats) {
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
    console.log(chats[0]);
    $("#digitor-body").append(`
    <div style="padding-left:20rem;padding-right:20rem;padding-top:3rem">
    <div class="card" style="width: 36rem;">
        <div class="card-body">
            <ul id="curr_chat" class="list-group list-group-flush"></ul>
        </div>
    </div>
    </div>
    `);
    let uid = getInfo()[2];
    console.log(chats[0]);
    for (let i = chats.length-1; i >= 0; i--) {
        let curr_chat = chats[i]['message'];
        let isMine = chats[i]['sender_uid']==uid;
        $('#curr_chat').append(`
            <li class="list-group-item card-text`+(isMine?` text-right`:``)+`"
                style="padding-`+(isMine?`left`:`right`)+`:6rem">`+curr_chat+`
                <br>
                <small class="text-muted">`+new Date(chats[i]['time']).toDateString()+`</small>
                </li>
        `);
    }
};