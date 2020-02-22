let action = new URLSearchParams(window.location.search).get("action");
if (action != null) {
    loadDetailsById(action);
} else {
    loadLastMonth();
}
var selection = 0;
var upcoming_month = "Upcoming events this month:";

function loadLastSelection() {
    if (selection === 5) {
        loadSearch(true);
    } else {
        loadLastMonth();
    }
}

function setActiveBtn() {
    var btn = document.getElementById("eventspagebtn");
    btn.className += " active";
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Search an event";
}

function loadSearch(override, token) {
    let select = document.getElementById("searchBar");
    if (select.value) {
        let request = new XMLHttpRequest();
        let s_search = (override) ? search : select.value;
        let params = "?search=" + s_search;
        request.open('GET', getURL() + '/api/event/search' + params, true);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.onload = function () {
            if (request.status == 200) {
                upcoming_month = "Events in \"" + s_search + "\":";
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
        selection = 0;
        loadLastMonth();
    }
}

function loadDetailsById(code) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/event/?eventcode=' + code, true);
    request.onload = function () {
        let event = JSON.parse(this.response);
        openDetails(event);
    };
    request.send();
}

function loadLastMonth() {
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
        populateList(data, request.status);
    };
    request.send();
}

function clearPage() {
    let app = document.getElementById('root');
    app.innerHTML = "";
}

function populateList(data, status) {
    let app = document.getElementById('root');
    let container = document.createElement('div');
    app.appendChild(container);
    if (status >= 200 && status < 400) {
        clearPage();
        let container = document.createElement('div');
        app.appendChild(container);
        let label = document.createElement('div');
        label.setAttribute('class', 'label-search-page');
        let suggestionText = document.createElement('h3');
        let suggestionSubtext = document.createElement('h3');
        suggestionText.setAttribute('class', 'main-text-profile');
        suggestionSubtext.setAttribute('class', 'details-label-text');
        suggestionText.innerHTML = upcoming_month;
        upcoming_month = "Upcoming events this month:";
        suggestionSubtext.innerHTML = "Use the searchbar to find other events.";
        label.appendChild(suggestionText);
        label.appendChild(suggestionSubtext);
        container.appendChild(label);

        if(data.length === 0){
            let label = document.createElement('div');
            label.setAttribute('class', 'label-search-page');
            let hr = document.createElement('hr');
            let suggestionText = document.createElement('h3');
            let suggestionSubtext = document.createElement('h3');
            suggestionText.setAttribute('class', 'main-text-profile');
            suggestionSubtext.setAttribute('class', 'details-label-text');
            suggestionText.innerHTML = "No events were found";
            suggestionSubtext.innerHTML = "We are sorry for the inconvenience. Our website is always expanding, try again at a later date!";
            label.appendChild(hr);
            label.appendChild(suggestionText);
            label.appendChild(suggestionSubtext);
            container.appendChild(label);
        }


        data.forEach(event => {
            let left = document.createElement('span');
            left.setAttribute('class', 'book-card-left');
            let right = document.createElement('span');
            right.setAttribute('class', 'author-card-right');
            let card = document.createElement('div');
            card.setAttribute('class', 'event-card');
            let name = document.createElement('h1');
            name.textContent = event.name;
            let dateAndLocation = document.createElement('h3');
            let eventDate = new Date(event.date);
            dateAndLocation.innerHTML = eventDate.getDate() + "/" + (eventDate.getMonth() + 1) + "/" + eventDate.getFullYear();
            dateAndLocation.innerHTML = dateAndLocation.innerHTML.concat(", </b>" + "<a href=\"https://maps.google.com/?q=" + event.location + "\" target=\"_blank\">" + event.location + "</a>");
            let photo = document.createElement('img');
            photo.setAttribute('class', 'image-list');
            photo.src = '../assets/img/events/' + event.picture;
            left.appendChild(photo);
            card.appendChild(left);
            card.appendChild(right);
            container.appendChild(card);
            right.appendChild(name);
            right.appendChild(dateAndLocation);
            card.addEventListener('click', function () {
                openDetails(event);
            }, false);
        });

        let spacer = document.createElement('div');
        spacer.setAttribute('class', 'list-spacer');
        container.appendChild(spacer);

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

function openDetails(event) {
    let app = document.getElementById('root');
    clearPage();
    let container = document.createElement('div');
    container.setAttribute('id', 'event-container');
    container.setAttribute('class', 'event-container');
    app.appendChild(container);
    $("#event-container").load("event.html", function () {
        let image = document.getElementById('event-details-image');
        image.src = '../assets/img/events/' + event.picture;
        document.getElementById('event-details-name').innerHTML = event.name;
        let eventDate = new Date(event.date);
        let eventDateText = eventDate.getDate() + "/" + (eventDate.getMonth() + 1) + "/" + eventDate.getFullYear();
        document.getElementById('event-details-dateAndLocation').innerHTML = "<b>" + eventDateText + ", </b>" + "<a href=\"https://maps.google.com/?q=" + event.location + "\" target=\"_blank\">" + event.location + "</a>";
        document.getElementById('event-details-organizer').innerHTML = "<b>Organized by: </b>" + event.organizer;
        document.getElementById('event-details-description').innerHTML = event.description;
        if(event.website){
            document.getElementById('event-details-website').innerHTML = "<b>Website: </b>" + "<a href=\"" + event.website + "\" target=\"_blank\">" + event.website + "</a>";
        }
        let bookContainer = document.getElementById('event-books-container');
        let request = new XMLHttpRequest();
        request.open('GET', getURL() + '/api/book/findByEvent/?eventcode=' + event.eventcode, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400 && request.status !== 204) {
                let data = JSON.parse(this.response);
                if (data.length > 0)
                    document.getElementById('event-details-text').setAttribute('class', 'event-details-text');
                data.forEach(book => {
                    let card = document.createElement('div');
                    card.setAttribute('class', 'event-books-container-card');
                    card.setAttribute('onclick', 'booksDetailsPage("' + book.isbn + '")');
                    let cover = document.createElement('img');
                    cover.setAttribute('class', 'image-event-book-list');
                    cover.src = '../assets/img/covers/' + book.picture;
                    let title = document.createElement('h5');
                    title.textContent = book.title;
                    card.appendChild(cover);
                    card.appendChild(title);
                    bookContainer.appendChild(card);
                });
            } else if (request.status === 204) {
                //NO RELATED EVENTS!
                document.getElementById('event-details-text').style.display = "none";
                document.getElementById('event-books-container').style.display = "none";


            } else {
                app.innerHTML = "";
                let errorMessage = document.createElement('marquee');
                errorMessage.textContent = `Gah, it's not working!`;
                app.appendChild(errorMessage)
            }
        };
        request.send();
    });


}