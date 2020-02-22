let token;
if (getLocalMode()) {
    token = getTokenCheat();
} else {
    token = readCookie('authToken');
    if (token == null) {
        window.location.href = getURL() + "/pages/signin.html";
    }
}

function giftCardRequest() {
    let id1_value = document.getElementById("id1").value;
    let id2_value = document.getElementById("id2").value;
    let points1_value = document.getElementById("points1").value;
    let points2_value = document.getElementById("points2").value;
    let request = new XMLHttpRequest();
    let obj = {id1: id1_value, id2: id2_value, points1: points1_value, points2: points2_value};
    let requestObj = JSON.stringify(obj);
    request.open('POST', getURL() + '/api/user/result', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        if (request.status === 400) {
            alert("Gift code not valid, try with another one please");
        } else {
            window.location.href = getURL() + '/pages/profile.html';
        }
    };
    request.send(requestObj);
}

function setActiveBtn() {
    var btn = document.getElementById("redeempagebtn");
    btn.className += " active";
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.setAttribute('class', 'gone');
}

