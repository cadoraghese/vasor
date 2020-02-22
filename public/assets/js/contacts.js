function contactRequest() {
    let object = document.getElementById("object").value;
    let question = document.getElementById("question").value;
    let email = document.getElementById("email").value;
    document.getElementById("contact-form-outer").style.display = "none";
    document.getElementById("contact-form-outer-v2").style.display = "";
}

function setActiveBtn() {
    var btn = document.getElementById("contactspagebtn");
    btn.className += " active";
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.setAttribute('class', 'gone');
}
