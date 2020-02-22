let token;
if (getLocalMode()) {
    token = getTokenCheat();
    loadCart(token);
} else {
    token = readCookie('authToken');
    if (token == null) {
        window.location.href = getURL() + "/pages/signin.html";
    } else {
        loadCart(token);
    }
}

var user;

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Edit your cart";
}

function setActiveBtn() {
    var btn = document.getElementById("cartpagebtn");
    btn.className += " active";
}

function loadSearch(override, token2) {
    let select = document.getElementById("searchBar");
    if (select.value) {
        let request = new XMLHttpRequest();
        let s_search = (override) ? search : select.value;
        let params = "?search=" + s_search;
        request.open('GET', getURL() + '/api/shopping_cart/search' + params, true);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.setRequestHeader('api_key', "api_key " + token);
        request.onload = function () {
            if (request.status == 200) {
                let data = JSON.parse(this.response);
                populateList(data, request.status);
            } else {
                let data = "";
                populateList(data, request.status);
            }
            selection = 5;
            search = s_search
        };
        request.send();
    } else {
        loadCart(token);
    }
}

function loadCart(token) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/shopping_cart/list', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        if (request.status === 204) {
            emptyCartPage();
        } else {
            let data = JSON.parse(this.response);
            populateList(data, request.status);
        }

    };
    request.send();
}

function loadProfile(token, elem1, elem2, totalPrice) {
    totalPrice = totalPrice.toFixed(2);
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/user/profile', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        user = JSON.parse(this.response);
        let finalPrice = Math.max(0, totalPrice - user.account_credit);
        elem1.textContent = user.address;
        elem2.textContent = "Total price: " + finalPrice + "$" + ((user.account_credit === 0) ? "" : " (" +
            ((totalPrice < user.account_credit) ? totalPrice : user.account_credit) + "$ will be subtracted from your account credit.)");
    };
    request.send();
}

function removeFromCart(isbn, quantity) {
    let requestObj = JSON.stringify({isbn, quantity});
    let request = new XMLHttpRequest();
    request.open('DELETE', getURL() + '/api/shopping_cart/remove', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        location.reload();
    };
    request.send(requestObj);
}

function placeOrder(data) {
    let obj = {payment_method: "PayPal", address: user.address, order_details: []};
    data.forEach(book => {
        let bookObj = {isbn: book.isbn, quantity: book.quantity, price: book.price};
        obj.order_details.push(bookObj);
    });
    let requestObj = JSON.stringify(obj);
    let request = new XMLHttpRequest();
    request.open('POST', getURL() + '/api/order/place', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        window.location.href = getURL() + "/pages/profile.html";
    };
    request.send(requestObj);
}

function emptyCartPage() {
    let app = document.getElementById('root');
    clearPage();
    let intro = document.createElement('div');
    intro.setAttribute('class', 'cart-intro-div');
    let text = document.createElement('h2');
    text.innerText = "You currently don't have any item in your cart.";
    intro.appendChild(text);
    app.appendChild(intro);
}

function populateList(data, status) {
    let app = document.getElementById('root');
    let container = document.createElement('div');
    app.appendChild(container);
    if (status >= 200 && status < 400) {
        clearPage();
        let container = document.createElement('div');
        app.appendChild(container);
        let intro = document.createElement('div');
        intro.setAttribute('class', 'cart-intro-div');
        let text4 = document.createElement('h2');
        let text = document.createElement('h1');
        text.textContent = "You have " + data.length + ((data.length === 1)?" item":" different items") + " in your cart!";
        let text2 = document.createElement('h2');
        text2.textContent = "Do you want to place an order? It will be shipped to: ";
        let text3 = document.createElement('h2');
        let orderButton = document.createElement('button');
        let breaks = document.createElement('div');
        breaks.setAttribute('class', 'small-spacer');
        orderButton.innerHTML = "Confirm order";
        orderButton.addEventListener("click", function () {
            placeOrder(data);
        });
        intro.appendChild(text);
        intro.appendChild(text4);
        intro.appendChild(text2);
        intro.appendChild(text3);
        intro.appendChild(orderButton);
        intro.appendChild(breaks);
        container.appendChild(intro);
        let totalPrice = 0;
        data.forEach(book => {
            totalPrice = totalPrice + (book.quantity * book.price);
        });
        loadProfile(token, text3, text4, totalPrice);

        data.forEach(book => {
            let left = document.createElement('span');
            left.setAttribute('class', 'book-card-left');

            let right = document.createElement('span');
            right.setAttribute('class', 'book-card-right');

            let side = document.createElement('span');
            side.setAttribute('class', 'book-card-button');

            let card = document.createElement('div');
            card.setAttribute('class', 'book-card');

            let title = document.createElement('h1');
            title.textContent = book.title;
            let quantity = document.createElement('h2');
            quantity.textContent = "Quantity: " + book.quantity;
            let productImage = document.createElement('img');
            productImage.setAttribute('class', 'image-list');
            productImage.src = '../assets/img/covers/' + book.picture;
            let price = document.createElement('h2');
            let priceText = book.list_price + "$";
            if (book.list_price !== book.price) {
                let sale = calculateSaleAmount(book.list_price, book.price);
                priceText = book.price + "$" + " (" + sale + "% Off!)"
            }
            let removeButton = document.createElement('button');
            removeButton.innerHTML = "Remove";
            removeButton.addEventListener("click", function () {
                event.stopPropagation();
                removeFromCart(book.isbn, book.quantity);
            });
            card.setAttribute('onclick', 'booksDetailsPage("' + (book.isbn) + '")');
            price.innerHTML = priceText;
            right.appendChild(title);
            right.appendChild(quantity);
            right.appendChild(price);
            side.appendChild(removeButton);
            left.appendChild(productImage);
            card.appendChild(left);
            card.appendChild(right);
            card.appendChild(side);
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

function booksDetailsPage(isbnValue) {
    let hiddenForm = document.getElementById('bookDetailsActionGeneral');
    let isbn = document.getElementById('bookDetailsActionIsbnInput');
    isbn.value = isbnValue;
    hiddenForm.submit();
}


function calculateSaleAmount(listPrice, price) {
    return (100 * (listPrice - price) / listPrice).toFixed(0);
}