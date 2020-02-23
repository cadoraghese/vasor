let token;
if(getLocalMode()){
    token = getTokenCheat();
    loadRanking(token);
}else{
    token = readCookie('authToken');
    if(token == null){
        window.location.href = getURL() + "/pages/signin.html";
    }else{
        loadRanking(token);
    }
}


function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Edit your cart";
}

function loadRanking(token) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/fencing/ranking', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        let data = JSON.parse(this.response);
        populateRanking(data, request.status)
    };
    request.send();
}

function setActiveBtn() {}

function setActiveBtnUp() {
    var btn = document.getElementById("header-signup");
    btn.className += " active";
}


function logout() {
    deleteCookie("authToken");
    window.location.href = getURL() + "/";
}

function populateRanking(data, status) {
    let app = document.getElementById('root');
    let container = document.createElement('div');
    app.appendChild(container);
    if (status >= 200 && status < 400) {
        clearPage();
        let container = document.createElement('div');
        app.appendChild(container);
        data.forEach(fencer => {
            let right = document.createElement('span');
            right.setAttribute('class', 'book-card-right');

            let card = document.createElement('div');
            card.setAttribute('class', 'book-card');

            let name = document.createElement('h1');
            var name_text = fencer.name + ' ' + fencer.surname;
            if (fencer.nickname != null){
                name_text += '   aka ' + fencer.nickname;
            }
            name.textContent = name_text;
            let percentage = document.createElement('h2');
            percentage.textContent = "Percentage: " + Math.round(fencer.percentage * 10000)/100 + '% (Win: '+ fencer.win + '; Lose: ' + fencer.lose + ')';
            let points = document.createElement('h2');
            points.textContent = "Points difference: " + fencer.difference + ' (For: '+ fencer.points_for + '; Against: ' + fencer.points_against + ')';
            right.appendChild(name);
            right.appendChild(percentage);
            right.appendChild(points);
            card.appendChild(right);
            container.appendChild(card);

        });
        let spacer = document.createElement('div');
        spacer.setAttribute('class', 'list-spacer');
        container.appendChild(spacer);

    } else {
        app.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's empty!`;
        app.appendChild(errorMessage)
    }
}


function clearPage() {
    let app = document.getElementById('root');
    app.innerHTML = "";
}