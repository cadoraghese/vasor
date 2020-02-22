loadSuggestedBooks();
loadAllAuthors();
loadEventsNextMonth();

function loadSuggestedBooks() {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/listSuggestedReadings', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        populateList(data, request.status);
    };
    request.send();
}

function loadAllAuthors() {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/author/listAllAuthors', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        createAuthorCard(data, request.status);
    };
    request.send();
}

function loadEventsNextMonth() {
    let request = new XMLHttpRequest();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let newMonth = (month === 12) ? 1 : (month + 1);
    let newYear = (month === 12) ? (year + 1) : year;
    request.open('GET', getURL() + '/api/event/listEventsByPeriod?initial_date='
        + year + "-" + month + "-" + day +
        '&ending_date=' + newYear + "-" + newMonth + "-" + day, true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        createEventCard(data, request.status);
    };
    request.send();
}

function populateList(data, status) {
    let app = document.getElementById('home-container-books');
    if (status >= 200 && status < 400) {
        let count = 0;
        while (count < 12) {
            let book = data[count];
            count++;
            let up = document.createElement('div');
            up.setAttribute('class', 'home-card-up');
            let down = document.createElement('div');
            down.setAttribute('class', 'home-card-down');
            let card = document.createElement('div');
            card.setAttribute('class', 'home-book-card');
            let title = document.createElement('h3');
            title.setAttribute('class', 'title-book-home');
            title.textContent = book.title;
            let author = document.createElement('h4');
            author.setAttribute('class', 'author-book-home');
            let authors = book.authors.split(",");
            let authorsText = "";
            let countAuthors = 0;
            authors.forEach(author => {
                let name = author.split(":")[1];
                authorsText = authorsText.concat(((countAuthors === 0) ? "" : ", ") + name);
                countAuthors++;
            });
            author.textContent = authorsText;
            let productImage = document.createElement('img');
            productImage.setAttribute('class', 'image-grid-home');
            productImage.src = '../assets/img/covers/' + book.picture;
            let price = document.createElement('h4');
            price.setAttribute('class', 'price-book-home');
            price.textContent = book.price + " $";
            let priceOld = document.createElement('h4');
            priceOld.setAttribute('class', 'price-book-home');
            priceOld.setAttribute('style', 'text-decoration: line-through');
            priceOld.textContent = book.list_price + " $";
            up.appendChild(productImage);
            card.appendChild(up);
            card.appendChild(down);
            down.appendChild(title);
            down.appendChild(author);
            if (book.list_price != null && book.availability != "Not Available") {
                down.appendChild(price);
                if (book.list_price !== book.price)
                    down.appendChild(priceOld);
            }
            app.appendChild(card);
            card.addEventListener('click', function () {
                booksDetailsPage(book.isbn);
            }, false);
        }
    } else {
        app.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage)
    }
}

function booksDetailsPage(isbnValue) {
    let hiddenForm = document.getElementById('bookDetailsActionGeneral');
    let isbn = document.getElementById('bookDetailsActionIsbnInput');
    isbn.value = isbnValue;
    hiddenForm.submit();
}


function createAuthorCard(data, status) {
    let app = document.getElementById('home-container-author');
    if (status >= 200 && status < 400) {
        let author = data[Math.floor(Math.random() * data.length)];

        let left = document.createElement('div');
        let right = document.createElement('div');
        right.setAttribute('class', 'home-side-cell-info-outer');
        let rightinner = document.createElement('div');
        rightinner.setAttribute('class', 'home-side-cell-info-inner');
        rightinner2 = document.createElement('div');
        let name = document.createElement('h4');
        name.setAttribute('class', 'title-book-home');
        name.textContent = author.name + " " + author.surname;
        let text = document.createElement('h4');
        text.setAttribute('class', 'price-book-home');
        text.textContent = "Click for more details";
        let photo = document.createElement('img');
        photo.setAttribute('class', 'image-grid-home');
        photo.src = '../assets/img/photos/' + author.picture;
        left.appendChild(photo);
        app.appendChild(left);
        app.appendChild(right);
        right.appendChild(rightinner);
        rightinner.appendChild(rightinner2);
        rightinner2.appendChild(name);
        rightinner2.appendChild(text);
        app.addEventListener('click', function () {
            authorsDetailsPage(author.author_id);
        }, false);

    } else {
        app.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage)
    }
}

function createEventCard(data, status) {
    let app = document.getElementById('home-container-event');
    if (status >= 200 && status < 400) {
        let event = data[Math.floor(Math.random() * data.length)];

        let left = document.createElement('div');
        let right = document.createElement('div');
        right.setAttribute('class', 'home-side-cell-info-outer');
        let rightinner = document.createElement('div');
        rightinner.setAttribute('class', 'home-side-cell-info-inner');
        rightinner2 = document.createElement('div');
        let name = document.createElement('h4');
        name.setAttribute('class', 'title-book-home');
        name.textContent = event.name;
        let dateAndLocation = document.createElement('h4');
        dateAndLocation.setAttribute('class', 'author-book-home');
        let eventDate = new Date(event.date);
        dateAndLocation.textContent = eventDate.getDate() + "/" + (eventDate.getMonth() + 1) + "/" + eventDate.getFullYear();
        dateAndLocation.textContent = dateAndLocation.textContent.concat(", " + event.location);

        let text = document.createElement('h4');
        text.setAttribute('class', 'price-book-home');
        text.textContent = "Info and tickets";
        let photo = document.createElement('img');
        photo.setAttribute('class', 'image-grid-home');
        photo.src = '../assets/img/events/' + event.picture;
        left.appendChild(photo);
        app.appendChild(left);
        app.appendChild(right);
        right.appendChild(rightinner);
        rightinner.appendChild(rightinner2);
        rightinner2.appendChild(name);
        rightinner2.appendChild(dateAndLocation);
        rightinner2.appendChild(text);
        app.addEventListener('click', function () {
            eventsDetailsPage(event.eventcode);
        }, false);

    } else {
        app.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage)
    }
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.setAttribute('class', 'gone');
}


function authorsDetailsPage(option) {
    let hiddenForm = document.getElementById('authorActionGeneral');
    let action = document.getElementById('authorActionGeneralInput');
    action.value = option;
    hiddenForm.submit();
}

function eventsDetailsPage(option) {
    let hiddenForm = document.getElementById('eventActionGeneral');
    let action = document.getElementById('eventActionGeneralInput');
    action.value = option;
    hiddenForm.submit();
}
