import getIsLoggedIn from "./account_logic.js";
import { attemptLogin } from "./account_logic.js";

export default function loginMaker() {
    let str =
        `<div class="jumbotron">
    <form>
        <div class="form-group">
            <label>
                Email address
            </label>
            <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label>
                Password
            </label>
            <input type="password" class="form-control" id="password" placeholder="Password">
        </div>
        <button type="submit" id="submit-login" class="btn btn-primary">Submit</button>
        <button type="button" id="create-register" class="btn btn-primary">Create Account</button>
    </form>
    </div>
    <div id="digitor-error"></div>`;
    attemptLogin();
    $('#digitor-body').append(str);
    $('#submit-login').on("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        let email = $('#email')[0].value;
        let password = $('#password')[0].value;

        if (email === '' || password === '')
            return;

        let allData = {
            'email' : email,
            'password' : password
        }

        let result = await axios({
            method: 'put',
            url: 'http://localhost:3000/validateCredentials',
            data: allData
        });
        console.log(result.data);
        if (result.data.uid == '-1' || result.data.uid==undefined) {
            $("#digitor-error").empty();
            $("#digitor-error").append("<p>" + result.data["message"] + "</p>");
        } else {
            console.log(result.data['isMentor']);
            attemptLogin(email, password, result.data['uid'], result.data['isMentor']==1);
            window.location = '/index.html';
        }
    });
    $('#create-register').on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        $('#digitor-body').empty();

        let str =
            `<div class="jumbotron">
        <form>
            <div class="form-group">
                <label>
                    Email address
                </label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email">
            </div>
            <div class="form-group">
                <label>
                    Password
                </label>
                <input type="password" class="form-control" id="password" placeholder="Password">
            </div>
            <div class="form-group">
                <label>
                    Confirm Password
                </label>
                <input type="password" class="form-control" id="password-confirm" placeholder="Password">
            </div>
            <div class="form-group">
                <label>
                    First Name
                </label>
                <input type="input" class="form-control" id="fname" placeholder="First Name">
            </div>
            <div class="form-group">
                <label>
                    Last Name
                </label>
                <input type="input" class="form-control" id="lname" placeholder="Last Name">
            </div>
            <div class="form-group">
                <label>Class Year</label><br />
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="year" id="freshman-btn" value="option1" checked>
                    <label class="form-check-label">
                        Freshman
                    </label>
                </div>
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="year" id="sophomore-btn" value="option2">
                    <label class="form-check-label">
                        Sophomore
                    </label>
                </div>
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="year" id="junior-btn" value="option3">
                    <label class="form-check-label">
                        Junior
                    </label>
                </div>
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="year" id="senior-btn" value="option4">
                    <label class="form-check-label">
                        Senoir
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label>You Can Be a Mentor or User</label><br />
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="mentor-user" id="mentor-btn" value="option1" checked>
                    <label class="form-check-label">
                        Mentor
                    </label>
                </div>
                <div class="form-check-inline">
                    <input class="form-check-input" type="radio" name="mentor-user" id="user-btn" value="option2">
                    <label class="form-check-label">
                        User
                    </label>
                </div>
            </div>
            <button type="submit" id="submit-register" class="btn btn-primary">Create Account</button>
        </form>
        </div>
        <div id="digitor-error"></div>`;
        $('#digitor-body').append(str);
        $('#submit-register').on("click", finishRegistration);
    });
}

async function finishRegistration(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#digitor-error").empty();
    //email, pass, pass, fname, lname, year, mentor/user

    let email = $("#email").val();
    let password = $("#password").val();
    let confirm_password = $("#password-confirm").val();
    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let year = $("input[name='year']");
    year = year[0].checked ?
        0 :
        year[1].checked ?
            1 :
            year[2].checked ?
                2 : 3;
    //0 freshman
    //1 sophomore
    //2 junior
    //3 senior
    let isMentor = $("#mentor-btn")[0].checked;

    //register user
    //may already be a user
    let allData = {
        'email': email,
        'password': password,
        'fname': fname,
        'lname': lname,
        'year': year,
        'isMentor': isMentor
    };

    let result = await axios({
        method: 'post',
        url: 'http://localhost:3000/createUser',
        data: allData
    });
    console.log(result.data);
    if (result.data['uid'] == '-1') {
        $("#digitor-error").append("<p>" + result.data["message"] + "</p>");
    } else {
        attemptLogin(email, password, result.data['uid'], isMentor==1);
        window.location = '/index.html';
    }
}