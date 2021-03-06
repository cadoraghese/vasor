let token;
if (getLocalMode()) {
    token = getTokenCheat();
    loadFencers(token);
} else {
    token = readCookie('authToken');
    if(token == null){
        window.location.href = getURL() + "/pages/signin.html";
    }else{
        loadFencers(token);
    }
}

function loadFencers(token) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/fencing/fencers', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        let data = JSON.parse(this.response);
        editFencersDropdown(data);
        //populateUserInfo(data, request.status)
    };
    request.send();
}

function editFencersDropdown(data) {
    html = '';
    for (let i = 0; i < data.length; i++) {
        if (data[i].nickname != null) {
            html+='<option data-value="'+data[i].fencer_id+'" value="'+data[i].name+' '+data[i].surname+', '+data[i].nickname+'">';
        } else {
            html+='<option data-value="'+data[i].fencer_id+'" value="'+data[i].name+' '+data[i].surname+'">';
        }
    }
    document.getElementById('fencers1').innerHTML = html;
    document.getElementById('fencers2').innerHTML = html;

}

function resultRequest() {

    var x = $('#fencer1').val();
    var z = $('#fencers1');
    var val = $(z).find('option[value="' + x + '"]');
    var id1_value = val.attr('data-value');

    var x = $('#fencer2').val();
    var z = $('#fencers2');
    var val = $(z).find('option[value="' + x + '"]');
    var id2_value = val.attr('data-value');

    // let id1_value = parseInt(document.getElementById("fencer1").value);
    // let id2_value = parseInt(document.getElementById("fencer2").value);
    let points1_value = parseInt(document.getElementById("points1").value);
    let points2_value = parseInt(document.getElementById("points2").value);
    let request = new XMLHttpRequest();
    let obj = {result: {id1: id1_value, id2: id2_value, points1: points1_value, points2: points2_value}};
    let requestObj = JSON.stringify(obj);
    request.open('POST', getURL() + '/api/fencing/result', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        if (request.status === 400) {
            alert("Result not valid, try with another one please");
        } else if (request.status === 401) {
            alert("Result not valid, you inserted the same fencer twice");
        } else if (request.status === 402) {
            alert("Result not valid, it's a tie, there is no clear winner");
        } else if (request.status === 403) {
            alert("Result not valid, seriously? Negative points?");
        } else {
            document.getElementById("insert-result-form").reset();
            alert("Result accepted!");
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

