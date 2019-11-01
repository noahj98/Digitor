if (sessionStorage.getItem("isLoggedIn") === null)
    sessionStorage.setItem("isLoggedIn", "false");

export default function getIsLoggedIn() {
    return sessionStorage.getItem("isLoggedIn") === "true" ? true : false;
};

export function attemptLogin() {
    console.log("something");
    sessionStorage.setItem("isLoggedIn", "true");
    console.log("status: " + sessionStorage.getItem("isLoggedIn"));
};

export function logout() {
    console.log("something");
    sessionStorage.setItem("isLoggedIn", "false");
    console.log("status: " + sessionStorage.getItem("isLoggedIn"));
};