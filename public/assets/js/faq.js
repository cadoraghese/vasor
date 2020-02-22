var coll = document.getElementsByClassName("collapsible-faq");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("collapsible-active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function setActiveBtn() {
    var btn = document.getElementById("faqpagebtn");
    btn.className += " active";
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.setAttribute('class', 'gone');
}
