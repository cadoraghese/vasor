let token;
if(getLocalMode()){
    token = getTokenCheat();
    loadFencersold(token);
}else{
    token = readCookie('authToken');
    if(token == null){
        window.location.href = getURL() + "/pages/signin.html";
    }else{
        loadFencersold(token);
    }
}


function loadFencersold(token) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/fencing/fencers', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        let data = JSON.parse(this.response);
        console.log(data)
        populateUserInfo(data, request.status)
    };
    request.send();
}

function setActiveBtn() {}

function setActiveBtnUp() {
    var btn = document.getElementById("header-signup");
    btn.className += " active";
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Search a book you ordered";
}

function loadSearch(override, token2) {
    let select = document.getElementById("searchBar");
    if(select.value) {
        let request = new XMLHttpRequest();
        let s_search = (override) ? search : select.value;
        let params = "?search=" + s_search;
        request.open('GET', getURL() + '/api/order/search' + params, true);
        request.setRequestHeader('api_key', "api_key " + token);
        request.onload = function () {
            if (request.status == 200) {
                let data = JSON.parse(this.response);
                populateOrdersList(data, request.status);
            } else {
                let data = "";
                populateOrdersList(data, request.status);
            }
            selection = 5;
            search = s_search
        };
        request.send();
    }else{
        loadOrders(token);
    }
}


function populateUserInfo(data, status) {
    if (status >= 200 && status < 400) {
        let title = document.getElementById("main-text-profile");
        let credit = document.getElementById("text-profile-1");
        let email = document.getElementById("text-profile-2");
        let birthday = document.getElementById("text-profile-3");
        let nationality = document.getElementById("text-profile-4");
        let biography = document.getElementById("text-profile-5");
        let sex = document.getElementById("text-profile-6");
        let address = document.getElementById("text-profile-7");
        let birthdatyDate = new Date(data.birthday);
        let birthdayText = birthdatyDate.getDate() + "/" + (birthdatyDate.getMonth() + 1) + "/" + birthdatyDate.getFullYear();
        title.innerHTML = "Hi, " + data.name + " " + data.surname + "!";
        credit.innerHTML = "<b>Your account credit is: </b>" + data.account_credit + "$";
        email.innerHTML = "<b>Email: </b>" + data.email;
        birthday.innerHTML = "<b>Birthday: </b>" + birthdayText;
        nationality.innerHTML = "<b>Nationality: </b>" + data.nationality;
        biography.innerHTML = "<b>Bio: </b>" + data.biography;
        sex.innerHTML = "<b>Sex: </b>" + data.sex;
        address.innerHTML = "<b>Shipping address: </b>" + data.address;
    }

}

function logout() {
    deleteCookie("authToken");
    window.location.href = getURL() + "/";
}

function loadOrders(token) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/order/list', true);
    request.setRequestHeader('api_key', "api_key " + token);
    request.onload = function () {
        if(request.status === 204){
            emptyOrdersPage();
        }else {
            let data = JSON.parse(this.response);
            populateOrdersList(data, request.status);
        }
    };
    request.send();
}

function populateOrdersList(data, status) {
    let container = document.getElementById('root-orders');
    let titleZ = document.createElement('h1');
    titleZ.setAttribute('class', 'main-text-profile');
    titleZ.innerHTML = "Your orders:";
    if (status !== 204 && status >= 200 && status < 400) {
        clearPage();
        container.appendChild(titleZ);
        data.forEach(order => {
            let number = order.order_number;
            let details = order.order_details.split("~");
            let method = order.payment_method;
            let shipping = order.shipping_date;
            let date = order.date;
            let tracking = order.tracking_number;
            let status = order.status;
            let address = order.address;
            let left = document.createElement('div');
            left.setAttribute('class', 'order-card-left');
            let right = document.createElement('div');
            right.setAttribute('class', 'order-card-right');
            let card = document.createElement('div');
            card.setAttribute('class', 'profile-order-card');
            let orderNumber = document.createElement('h1');
            orderNumber.setAttribute('class', 'main-text-profile');
            orderNumber.textContent = "Order #" + number;
            let trackingNumber = document.createElement('h3');
            trackingNumber.setAttribute('class', 'secondary-text-profile');
            trackingNumber.innerHTML = "<b>Tracking number: </b>" + tracking;
            let paymentMethod = document.createElement('h3');
            paymentMethod.setAttribute('class', 'secondary-text-profile');
            paymentMethod.innerHTML = "<b>Payment method: </b>" + method;
            let dateElem = document.createElement('h3');
            dateElem.setAttribute('class', 'secondary-text-profile');
            let shipDateElem = document.createElement('h3');
            shipDateElem.setAttribute('class', 'secondary-text-profile');
            let dateFormatted = new Date(date);
            dateElem.innerHTML = "<b>Placed on: </b>" + dateFormatted.getDate() + "/" + (dateFormatted.getMonth() + 1) + "/" + dateFormatted.getFullYear();
            let shippingDateFormatted = new Date(shipping);
            shipDateElem.innerHTML = "<b>Shipping on: </b>" + shippingDateFormatted.getDate() + "/" + (shippingDateFormatted.getMonth() + 1) + "/" + shippingDateFormatted.getFullYear();
            let statusElem = document.createElement('h3');
            statusElem.setAttribute('class', 'secondary-text-profile');
            statusElem.innerHTML = "<b>Order status: </b>" + status;
            let addressElem = document.createElement('h3');
            addressElem.setAttribute('class', 'secondary-text-profile');
            addressElem.innerHTML = "<b>Shipping to: </b>" + address;
            let ordersElem = document.createElement('h3');
            ordersElem.setAttribute('class', 'main-text-profile');
            ordersElem.textContent = "Books in the order:";
            let count = 0;
            while (count < details.length){
                let book = details[count].split("{");
                let book_list = document.createElement('div');
                let book_image = document.createElement('div');
                book_image.setAttribute('class', 'order-inner-card-left');
                let book_details = document.createElement('div');
                book_list.setAttribute('class', 'order-inner-card-right');
                let isbn = book[0];
                let title = book[1];
                let picture = book[2];
                let quantity = book[3];
                let titleText = document.createElement('h3');
                let photo = document.createElement('img');
                photo.setAttribute('class', 'image-order-list');
                photo.src = '../assets/img/covers/' + picture;
                titleText.textContent = quantity + ((quantity < 2)?" copy of: ":" copies of: ") + title;
                book_list.setAttribute('onclick', 'booksDetailsPage("' + isbn + '")');
                book_details.appendChild(titleText);
                book_image.appendChild(photo);
                book_list.appendChild(book_details);
                book_list.appendChild(book_image);
                right.appendChild(book_list);
                count++;
            }
            left.appendChild(orderNumber);
            left.appendChild(trackingNumber);
            left.appendChild(paymentMethod);
            left.appendChild(addressElem);
            left.appendChild(dateElem);
            left.appendChild(shipDateElem);
            left.appendChild(statusElem);
            left.appendChild(ordersElem);
            card.appendChild(left);
            card.appendChild(right);
            container.appendChild(card);
        });

        let spacer = document.createElement('div');
        spacer.setAttribute('class', 'list-spacer');
        container.appendChild(spacer);
    } else if(status === 204) {
        //NO ORDERS!
        clearPage();
        container.appendChild(titleZ);
        titleZ.innerHTML = "No orders match your search.";


    } else {
        container.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        container.appendChild(errorMessage)
    }
}

function emptyOrdersPage() {
    clearPage();
    let container = document.getElementById('root-orders');
    let titleN = document.createElement('h1');
    titleN.setAttribute('class', 'main-text-profile');
    titleN.innerHTML = "You don't have any orders yet.";
    container.appendChild(titleN);
}

function booksDetailsPage(isbnValue) {
    let hiddenForm = document.getElementById('bookDetailsActionGeneral');
    let isbn = document.getElementById('bookDetailsActionIsbnInput');
    isbn.value = isbnValue;
    hiddenForm.submit();
}

function clearPage() {
    let app = document.getElementById('root-orders');
    app.innerHTML = "";
}