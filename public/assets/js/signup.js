let token;
if (getLocalMode()) {
    token = getTokenCheat();
} else {
    token = readCookie('authToken');
    if (token != null) {
        window.location.href = getURL() + "/pages/profile.html";
    }
}

function checkInformation() {
    let password = document.getElementById("password");
    let passwordCheck = document.getElementById("password-check");
    return password.value === passwordCheck.value;
}

function signUpRequest() {
    let name = document.getElementById("name").value;
    let surname = document.getElementById("surname").value;
    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let birthday = document.getElementById("birthday").value;
    let nationality = document.getElementById("nationality").value;
    let biography = document.getElementById("biography").value;
    let sex = document.getElementById("sex").value;
    let address = document.getElementById("address").value;

    let request = new XMLHttpRequest();
    request.open('POST', getURL() + '/api/user/signup?' +
        'name=' + name +
        '&surname=' + surname +
        '&password=' + password +
        '&username=' + username +
        '&email=' + email +
        '&birthday=' + birthday +
        '&nationality=' + nationality +
        '&biography=' + biography +
        '&sex=' + sex +
        '&address=' + address, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        if(this.status === 201)
            window.location.href = getURL() + "/pages/signin.html";
        else{
            alert("There was an error performing you request. Please check your data before submitting.");
        }
    };
    request.send();
}

function goHome() {
    window.location.href = getURL() + "/";
}