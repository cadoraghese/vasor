let token;
if (getLocalMode()) {
    token = getTokenCheat();
} else {
    token = readCookie('authToken');
    if (token != null) {
        window.location.href = getURL() + "/pages/profile.html";
    }
}

function signInRequest() {
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let request = new XMLHttpRequest();
    request.open('POST', getURL() + '/api/user/login?email='
        + email + '&password=' + password, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        if(this.status === 200){
            createCookie("authToken", JSON.parse(this.response).token, 1);
            window.location.href = getURL() + "/";
        }else if(this.status === 401){
            alert("These credentials don't coincide with any existing user. Please check your input and retry.");
        }else{
            alert("There was an error performing you request. Please check your data before submitting.");
        }
    };
    request.send();
}

function goHome() {
    window.location.href = getURL() + "/";
}

