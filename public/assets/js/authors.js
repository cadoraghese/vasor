let action = new URLSearchParams(window.location.search).get("action");
if (action != null) {
    loadDetailsById(action);
} else {
    loadAll();
}
var selection = 0;

function setActiveBtn() {
    var btn = document.getElementById("authorspagebtn");
    btn.className += " active";
}


function loadLastSelection() {
    if (selection === 5) {
        loadSearch(true);
    } else {
        loadAll();
    }
}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Search an author";
}

function loadSearch(override, token) {
    let select = document.getElementById("searchBar");
    if (select.value) {
        let request = new XMLHttpRequest();
        let s_search = (override) ? search : select.value;
        let params = "?search=" + s_search;
        request.open('GET', getURL() + '/api/author/search' + params, true);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
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
        selection = 0;
        loadAll();
    }
}

function loadDetailsById(id) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/author/?author_id=' + id, true);
    request.onload = function () {
        let author = JSON.parse(this.response);
        openDetails(author);
    };
    request.send();
}

function loadAll() {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/author/listAllAuthors', true);
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
        /*let label = document.createElement('div');
        label.setAttribute('class', 'label-search-page');
        let suggestionText = document.createElement('h3');
        let suggestionSubtext = document.createElement('h3');
        suggestionText.setAttribute('class', 'main-text-profile');
        suggestionSubtext.setAttribute('class', 'details-label-text');
        suggestionText.innerHTML = "All the authors on our website:";
        suggestionSubtext.innerHTML = "Use the searchbar to find other authors.";
        label.appendChild(suggestionText);
        label.appendChild(suggestionSubtext);
        container.appendChild(label);*/
        if(data.length === 0){
            let label = document.createElement('div');
            label.setAttribute('class', 'label-search-page');
            let suggestionText = document.createElement('h3');
            let suggestionSubtext = document.createElement('h3');
            suggestionText.setAttribute('class', 'main-text-profile');
            suggestionSubtext.setAttribute('class', 'details-label-text');
            suggestionText.innerHTML = "No authors were found";
            suggestionSubtext.innerHTML = "We are sorry for the inconvenience. Our catalogue is always expanding, try again at a later date!";
            label.appendChild(suggestionText);
            label.appendChild(suggestionSubtext);
            container.appendChild(label);
        }

        data.forEach(author => {
            let left = document.createElement('span');
            left.setAttribute('class', 'book-card-left');
            let right = document.createElement('span');
            right.setAttribute('class', 'author-card-right');
            let card = document.createElement('div');
            card.setAttribute('class', 'author-card');
            let name = document.createElement('h1');
            name.textContent = author.name + " " + author.surname;
            let birthday = document.createElement('h3');
            let birthdatyDate = new Date(author.birthday);
            birthday.textContent = birthdatyDate.getDate() + "/" + (birthdatyDate.getMonth() + 1) + "/" + birthdatyDate.getFullYear();
            let sexAndNationality = document.createElement('h3');
            sexAndNationality.textContent = author.sex + ", " + author.nationality;
            let photo = document.createElement('img');
            photo.setAttribute('class', 'image-list');
            photo.src = '../assets/img/photos/' + author.picture;
            left.appendChild(photo);
            card.appendChild(left);
            card.appendChild(right);
            container.appendChild(card);
            right.appendChild(name);
            right.appendChild(birthday);
            right.appendChild(sexAndNationality);

            card.addEventListener('click', function () {
                openDetails(author);
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

function openDetails(author) {
    let app = document.getElementById('root');
    clearPage();
    let container = document.createElement('div');
    container.setAttribute('id', 'author-container');
    container.setAttribute('class', 'author-container');
    app.appendChild(container);
    $("#author-container").load("author.html", function () {
        let image = document.getElementById('author-details-image');
        image.src = '../assets/img/photos/' + author.picture;
        document.getElementById('author-details-name').innerHTML = author.name + " " + author.surname;
        let birthdatyDate = new Date(author.birthday);
        let birthdayText = birthdatyDate.getDate() + "/" + (birthdatyDate.getMonth() + 1) + "/" + birthdatyDate.getFullYear();
        document.getElementById('author-details-birthday').innerHTML = "<b>Born: </b>" + birthdayText;
        document.getElementById('author-details-sexAndNationality').innerHTML = "<b>Sex and nationality: </b>" + author.sex + ", " + author.nationality;
        document.getElementById('author-details-biography').innerHTML = author.biography;
        let bookContainer = document.getElementById('author-books-container');
        let request = new XMLHttpRequest();
        request.open('GET', getURL() + '/api/book/findByAuthor/?author_id=' + author.author_id, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400 && request.status !== 204) {
                let data = JSON.parse(this.response);
                data.forEach(book => {
                    let card = document.createElement('div');
                    card.setAttribute('class', 'author-books-container-card');
                    card.setAttribute('onclick', 'booksDetailsPage("' + (book.isbn) + '")');
                    let cover = document.createElement('img');
                    cover.setAttribute('class', 'image-author-book-list');
                    cover.src = '../assets/img/covers/' + book.picture;
                    let title = document.createElement('h5');
                    title.textContent = book.title;
                    card.appendChild(cover);
                    card.appendChild(title);
                    bookContainer.appendChild(card);
                });
            } else if (request.status === 204) {
                //NO RELATED EVENTS!
                document.getElementById('author-details-text').style.display = "none";
                document.getElementById('author-books-container').style.display = "none";
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