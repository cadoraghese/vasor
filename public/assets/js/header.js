function booksPage(option) {
    let hiddenForm = document.getElementById('bookActionGeneral');
    let action = document.getElementById('bookActionGeneralInput');
    action.value = option;
    hiddenForm.submit();
}

loadSessionButtons();

function loadSessionButtons() {
    let sessionCookie = readCookie("authToken");
    let signin_button = document.getElementById("header-signin");
    let signup_button = document.getElementById("header-signup");
    let cart_button = document.getElementById("cart-button");

    if (getLocalMode() || sessionCookie != null) {
        signin_button.setAttribute("class", "gone");
        signup_button.innerHTML = "Account";
        signup_button.setAttribute("href", "profile.html");
    } else {
        signin_button.innerHTML = "Sign In";
        signup_button.innerHTML = "Sign Up";
        signup_button.setAttribute("href", "signup.html");
        signin_button.setAttribute("href", "signin.html");
        cart_button.setAttribute("href", "signin.html");
    }

}

function activateHomeBtn() {
    let homebtn = document.getElementById("homebtn");
    homebtn.addEventListener('click', function () {
        window.location.href = getURL() + "/";
    }, false);
}


