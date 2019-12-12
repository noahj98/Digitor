export default function getIsLoggedIn() {
    return localStorage.getItem("isLoggedIn") === 'true' ? true : false;
};

export function attemptLogin(email, pw, uid, isMentor) {
    localStorage.setItem("digitor-email", email);
    localStorage.setItem("digitor-password", pw);
    localStorage.setItem("digitor-uid", uid);
    localStorage.setItem("digitor-isMentor", isMentor)
    localStorage.setItem("isLoggedIn", 'true');
};

export function logout() {
    localStorage.setItem("digitor-email", undefined);
    localStorage.setItem("digitor-password", undefined);
    localStorage.setItem("digitor-uid", undefined);
    localStorage.setItem("digitor-isMentor", undefined);
    localStorage.setItem("isLoggedIn", 'false');
};

export function getInfo() {
    return [
        localStorage.getItem("digitor-email"),
        localStorage.getItem("digitor-password"),
        localStorage.getItem("digitor-uid"),
        localStorage.getItem("digitor-isMentor")
    ];
}