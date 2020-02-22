let token;
if(getLocalMode()){
    token = getTokenCheat();
}else{
    token = readCookie('authToken');
}

var disableFilters = false;
var loadedSimilar = false;
var loadedEvents = false;

(function() {
    var startingTime = new Date().getTime();
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://code.jquery.com/jquery-3.3.1.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 20);
        }
    };

    // Start polling...
    checkReady(function($) {
        $(function() {
            var endingTime = new Date().getTime();
            var tookTime = endingTime - startingTime;
            //window.alert("jQuery is loaded, after " + tookTime + " milliseconds!");
        });
    });
})();

var selection, theme, genre, search, btnactive;
let action = new URLSearchParams(window.location.search).get("action");
let isbn = new URLSearchParams(window.location.search).get("isbn");
loadGenresList();
loadThemesList();
if(isbn != null) {
    loadDetailsByIsbn(isbn);
    setActiveBtnOption("bookspagebtn");
}else{
    if(action != null) {
        if (action == 0) {
            loadLatest();
            setActiveBtnOption("bookspagebtn");
        } else if (action == 1) {
            loadSuggested();
            setActiveBtnOption("suggestedpagebtn");
        } else if (action == 2) {
            loadBestSellers();
            setActiveBtnOption("bestsellerspagebtn");
        } else if (action == 3){

        }
    }else{
        loadLatest();
        setActiveBtnOption("bookspagebtn");
    }
}


function setActiveBtnOption(btnid) {
    btnactive = btnid;
}

function removeActiveBtn() {
    var btn = document.getElementById(btnactive);
    btn.classList.remove("active")
}

function setActiveBtn() {
    var btn = document.getElementById(btnactive);
    btn.className += " active";
    let headerC = document.getElementById('main-header');
    headerC.className += " noborderbottom";
}

function loadGenresList(){
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/getGenres', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        let select = document.getElementById("selectGenre");
        createSelectOptions(data, select, "genre");
    };
    request.send();
}

function loadThemesList(){
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/getThemes', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        let select = document.getElementById("selectTheme");
        createSelectOptions(data, select, "theme");
    };
    request.send();
}

function createSelectOptions(data, select, tag){
    let defaultOption = document.createElement('option');
    defaultOption.setAttribute('class', 'sidebar-select-option');
    defaultOption.value = "default";
    defaultOption.innerHTML = "No " + tag + " filter";
    select.appendChild(defaultOption);
    data.forEach(element =>{
        let option = document.createElement('option');
        option.setAttribute('class', 'sidebar-select-option');
        option.value = element[tag];
        option.innerHTML = element[tag];
        select.appendChild(option);
    });
}


function loadSuggested() {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/listSuggestedReadings', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        populateList(data, request.status, "", "");
        selection = 1;
    };
    request.send();
}


function loadLatest() {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/latest', true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        populateList(data, request.status, "", "");
        selection = 0;
    };
    request.send();
}

function loadBestSellers() {
    let request = new XMLHttpRequest();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let oldMonth = (month === 1)?12:(month-1);
    let oldYear = (month === 1)?(year-1):year;
    request.open('GET', getURL() + '/api/book/listBestSellers?ending_date='
        + year + "-" + month + "-" + day +
        '&initial_date=' + oldYear + "-" + oldMonth + "-" + day, true);
    request.onload = function () {
        let data = JSON.parse(this.response);
        populateList(data, request.status, "Best sellers this month", "See what other Bookaholics are reading!");
        selection = 3;
    };
    request.send();

}

function loadSearchPlaceholder() {
    let select = document.getElementById("searchBar");
    select.placeholder = "Search for a book or an author";
}

function loadSearch(override) {
    let select = document.getElementById("searchBar");
    let selectGenre = document.getElementById("selectGenre");
    let selectTheme = document.getElementById("selectTheme");
    if(select.value) {
        disableFilters = true;
        if(selectGenre.options[selectGenre.selectedIndex].value !== "default"){
            selectGenre.getElementsByTagName('option')[0].selected = 'selected';
        }
        if(selectTheme.options[selectTheme.selectedIndex].value !== "default"){
            selectTheme.getElementsByTagName('option')[0].selected = 'selected';
        }
        let request = new XMLHttpRequest();
        let s_search = (override) ? search : select.value;
        let params = "?search=" + s_search;
        request.open('GET', getURL() + '/api/book/search' + params, true);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8");
        request.onload = function () {
            selectGenre.disabled = true;
            selectTheme.disabled = true;
            if (request.status === 200) {
                removeActiveBtn();
                setActiveBtnOption("bookspagebtn");
                setActiveBtn();
                let data = JSON.parse(this.response);
                populateList(data, request.status, "", "");
            } else {
                let data = "";
                populateList(data, request.status, "", "");
            }
            selection = 5;
            search = s_search;
        };
        request.send();
    }else{
        selectGenre.disabled = false;
        selectTheme.disabled = false;
        disableFilters = false;
        loadLatest();
    }
}

function loadTheme(override){
    let select = document.getElementById("selectTheme");
    let select2 = document.getElementById("selectGenre");
    if(!disableFilters){
        disableFilters = true;
        if (select2.options[select2.selectedIndex].value !== "default") {
            select2.getElementsByTagName('option')[0].selected = 'selected';
        }
        select2.disabled = true;
        if(select.options[select.selectedIndex].value !== "default") {
            let request = new XMLHttpRequest();
            let s_theme = (override) ? theme : select.options[select.selectedIndex].value;
            let params = "?theme=" + s_theme;
            request.open('GET', getURL() + '/api/book/findByTheme' + params, true);
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");
            request.onload = function () {
                removeActiveBtn();
                setActiveBtnOption("bookspagebtn");
                setActiveBtn();
                let data = JSON.parse(this.response);
                populateList(data, request.status, "", "");
                selection = 3;
                theme = s_theme;
                disableFilters = false;
            };
            request.send();
        }else{
            disableFilters = false;
            select2.disabled = false;
            loadLatest();
        }
    }
}

function loadGenre(override){
    let select = document.getElementById("selectGenre");
    let select2 = document.getElementById("selectTheme");
    if(!disableFilters){
        disableFilters = true;
        if (select2.options[select2.selectedIndex].value !== "default") {
            select2.getElementsByTagName('option')[0].selected = 'selected';
        }
        select2.disabled = true;
        if(select.options[select.selectedIndex].value !== "default"){
            let request = new XMLHttpRequest();
            let s_genre = (override)?genre:select.options[select.selectedIndex].value;
            let params = "?genre=" + s_genre;
            request.open('GET', getURL() + '/api/book/findByGenre' + params, true);
            request.setRequestHeader("Content-type", "application/json; charset=utf-8");
            request.onload = function() {
                removeActiveBtn();
                setActiveBtnOption("bookspagebtn");
                setActiveBtn();
                let data = JSON.parse(this.response);
                populateList(data, request.status, "", "");
                selection = 4;
                genre = s_genre;
                disableFilters = false;
            };
            request.send();
        }else{
            disableFilters = false;
            select2.disabled = false;
            loadLatest();
        }
    }
}

function loadLastSelection() {
    if(selection === 0){
        loadLatest();
    }else if(selection === 1){
        loadSuggested();
    }else if(selection === 2){
        loadBestSellers();
    }else if(selection === 3){
        loadTheme(true);
    }else if(selection === 4){
        loadGenre(true);
    }else if(selection === 5){
        loadSearch(true);
    }else{
        loadLatest();
    }
}

function loadDetailsByIsbn(isbn) {
    let request = new XMLHttpRequest();
    request.open('GET', getURL() + '/api/book/?isbn=' + isbn, true);
    request.onload = function () {
        let book = JSON.parse(this.response);
        openDetails(book);
        setActiveBtn();
    };
    request.send();
}


function requestAddToCart(isbn) {
    if(token === null){
        window.location.href = getURL() + "/pages/signin.html";
    }else{
        let quantitySelect = document.getElementById("quantity_"+isbn);
        let quantity = parseInt(quantitySelect.value);
        let requestObj = JSON.stringify({isbn, quantity});
        let request = new XMLHttpRequest();
        request.open('POST', getURL() + '/api/shopping_cart/add', true);
        request.setRequestHeader('api_key', "api_key " + token);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function () {
            window.location.href = getURL() + "/pages/cart.html";
        };
        request.send(requestObj);
    }

}


function populateList(data, status, message, submessage) {
    let app = document.getElementById('root');
    let container = document.createElement('div');
    app.appendChild(container);
    if (status >= 200 && status < 400) {
        clearPage();
        loadedSimilar = false;
        loadedEvents = false;
        let container = document.createElement('div');
        app.appendChild(container);
        if(message !== ""){
            let label = document.createElement('div');
            label.setAttribute('class', 'label-search-page-books');
            let suggestionText = document.createElement('h3');
            let suggestionSubtext = document.createElement('h3');
            suggestionText.setAttribute('class', 'main-text-profile');
            suggestionSubtext.setAttribute('class', 'details-label-text');
            suggestionText.innerHTML = message;
            suggestionSubtext.innerHTML = submessage;
            label.appendChild(suggestionText);
            label.appendChild(suggestionSubtext);
            container.appendChild(label);
        }

        if(data.length === 0){
            let label = document.createElement('div');
            label.setAttribute('class', 'label-search-page-books');
            let suggestionText = document.createElement('h3');
            let suggestionSubtext = document.createElement('h3');
            suggestionText.setAttribute('class', 'main-text-profile');
            suggestionSubtext.setAttribute('class', 'details-label-text');
            suggestionText.innerHTML = "No books were found";
            suggestionSubtext.innerHTML = "We are sorry for the inconvenience. Our catalogue is always expanding, try again at a later date!";
            label.appendChild(suggestionText);
            label.appendChild(suggestionSubtext);
            container.appendChild(label);
        }


        data.forEach(book => {
            let left = document.createElement('span');
            left.setAttribute('class', 'book-card-left');

            let right = document.createElement('span');
            right.setAttribute('class', 'book-card-right');

            let buttonContainer = document.createElement('span');
            buttonContainer.setAttribute('class', 'book-card-button');

            let card = document.createElement('div');
            card.setAttribute('class', 'book-card');
            let title = document.createElement('h1');
            title.textContent = book.title;
            let author = document.createElement('h5');
            let authors = book.authors.split(",");
            let authorsText = "";
            let countAuthors = 0;
            authors.forEach(author =>{
                let name = author.split(":")[1];
                authorsText = authorsText.concat(((countAuthors === 0)?"":", ") + name);
                countAuthors++;
            });
            author.textContent = authorsText;
            let format = document.createElement('h3');
            format.textContent = book.availability + "  |  " + book.format;
            let productImage = document.createElement('img');
            productImage.setAttribute('class', 'image-list');
            productImage.src = '../assets/img/covers/' + book.picture;
            let price = document.createElement('h2');
            if(book.list_price != null && book.availability != "Not Available" ) {

                let priceText = book.list_price + "$";
                if (book.list_price !== book.price){
                    let sale = calculateSaleAmount(book.list_price, book.price);
                    priceText =  book.price + "$" + " (" + sale + "% Off!)"
                }
                price.textContent = priceText;
                let textQ = document.createElement('h3');
                textQ.setAttribute('class', 'add-to-cart-text');
                textQ.innerText = "Quantity:";
                let addToCart = document.createElement('button');
                addToCart.setAttribute('class', 'add-to-cart-button');
                addToCart.innerText = "Add to cart";
                let quantitySelect = document.createElement('select');
                quantitySelect.setAttribute('id', "quantity_" + book.isbn);
                quantitySelect.setAttribute('class', "select-quantity-cart");
                for(let i = 1; i < 10; i++) {
                    let option = document.createElement('option');
                    option.innerText = i;
                    option.setAttribute('value', i);
                    quantitySelect.appendChild(option);
                }
                quantitySelect.addEventListener('click', function() {
                    event.stopPropagation();
                }, false);
                addToCart.addEventListener('click', function() {
                    event.stopPropagation();
                    requestAddToCart(book.isbn);
                }, false);

                buttonContainer.appendChild(textQ);
                buttonContainer.appendChild(quantitySelect);
                buttonContainer.appendChild(addToCart);

            }

            left.appendChild(productImage);
            card.appendChild(left);
            card.appendChild(right);
            if(book.list_price != null && book.availability != "Not Available" ) {
                card.appendChild(buttonContainer);
            }
            card.appendChild(buttonContainer);
            container.appendChild(card);
            right.appendChild(title);
            right.appendChild(author);
            if(book.list_price != null && book.availability != "Not Available" ) {
                right.appendChild(price);
            }
            right.appendChild(format);

            card.addEventListener('click', function() {
                openDetails(book);
            }, false);
        });

        let spacer = document.createElement('div');
        spacer.setAttribute('class', 'list-spacer');
        container.appendChild(spacer);
        setSidebarHeight();
    } else {
        app.innerHTML = "";
        let errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage)
    }
}

function setSidebarHeight() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width > 800){
        document.getElementById("mySidebar").style.height = document.getElementById('root').offsetHeight + "px";
    }else{
        document.getElementById("mySidebar").style.height = "";
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

function openDetails(book){
    let app = document.getElementById('root');
    clearPage();
    let container = document.createElement('div');
    container.setAttribute('id', 'book-container');
    app.appendChild(container);
    $("#book-container").load("book.html", function () {
        let image = document.getElementById('book-details-image');
        image.src = '../assets/img/covers/' + book.picture;
        document.getElementById('book-details-title').innerHTML = book.title;
        let authors = book.authors.split(",");
        let authorsText = "";
        let countAuthors = 0;
        authors.forEach(author =>{
            let name = author.split(":")[1];
            let nameLink = "<a href='#' onclick='authorsDetailsPage(" + author.split(':')[0] + ")'>" + name + "</a>";
            authorsText = authorsText.concat(((countAuthors === 0)?"":", ") + nameLink);
            countAuthors++;
        });
        document.getElementById('book-details-authors').innerHTML = authorsText;
        document.getElementById('book-details-genre').innerHTML = "<b>Genre: </b>" + book.genre;
        let themes = book.themes.split(",");
        let themesText = "";
        let countThemes = 0;
        themes.forEach(theme =>{
            themesText = themesText.concat(((countThemes === 0)?"":", ") + theme);
            countThemes++;
        });
        document.getElementById('book-details-themes').innerHTML = "<b>Themes: </b>" + themesText;
        document.getElementById('book-details-description').innerText = book.description;
        let priceText = book.price;
        if (book.list_price !== book.price){
            let sale = calculateSaleAmount(book.list_price, book.price);
            priceText =  book.price + "$" + " (" + sale + "% Off!)"
        }
        if(priceText != null){
            document.getElementById('book-details-price').innerHTML = "<b>Price: </b>" + priceText;
        }
        if(book.pages != null){
            document.getElementById('book-details-pages').innerHTML = "<b>Pages: </b>" + book.pages;
        }
        document.getElementById('book-details-publisher').innerHTML = "<b>Publisher: </b>" + book.publisher;
        let release_date = new Date(book.release_date);
        release_date = release_date.getDate() + "/" + (release_date.getMonth() + 1) + "/" + release_date.getFullYear();
        document.getElementById('book-details-release').innerHTML = "<b>Release date: </b>" + release_date;
        document.getElementById('book-details-isbn').innerHTML = "<b>ISBN: </b>" + book.isbn;
        document.getElementById('book-details-format').innerHTML = "<b>Format: </b>" + book.format;
        document.getElementById('book-details-collection').innerHTML = "<b>Collection: </b>" + book.collection;
        document.getElementById('book-details-availability').innerHTML = "<b>Availability: </b>" + book.availability;
        document.getElementById('book-details-language').innerHTML = "<b>Language: </b>" + book.language;

        if(priceText != null && book.availability != "Not Available" ) {
            let addToCart = document.getElementById('add-to-cart-button');
            let quantitySelect = document.getElementById('quantity_');
            quantitySelect.setAttribute('id', "quantity_" + book.isbn);
            for (let i = 1; i < 10; i++) {
                let option = document.createElement('option');
                option.innerText = i;
                option.setAttribute('value', i);
                quantitySelect.appendChild(option);
            }
            quantitySelect.addEventListener('click', function () {
                event.stopPropagation();
            }, false);
            addToCart.addEventListener('click', function () {
                event.stopPropagation();
                requestAddToCart(book.isbn);
            }, false);
        } else {
            document.getElementById('add-to-cart-button').style.display = "none";
            document.getElementById('quantity').style.display = "none";
            document.getElementById('quantity_').style.display = "none";
        }


        let bookContainer = document.getElementById('similar-books-container');
        let request = new XMLHttpRequest();
        request.open('GET', getURL() + '/api/book/findBySimilarity?isbn=' + book.isbn, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400 && request.status !== 204) {
                let data = JSON.parse(this.response);
                if(data.length > 0)
                    document.getElementById('book-details-text').setAttribute('class', 'book-details-text');
                data.forEach(bookS =>{
                    let card = document.createElement('div');
                    card.setAttribute('class', 'author-books-container-card');
                    card.setAttribute('onclick', 'booksDetailsPage("' + bookS.isbn +'")');
                    let cover = document.createElement('img');
                    cover.setAttribute('class', 'image-author-book-list');
                    cover.src = '../assets/img/covers/' + bookS.picture;
                    let title = document.createElement('h5');
                    title.textContent = bookS.title;
                    card.appendChild(cover);
                    card.appendChild(title);
                    bookContainer.appendChild(card);
                });
                loadedSimilar = true;
                if(loadedEvents){
                    setSidebarHeight();
                }
            } else if(request.status === 204) {
                //NO SIMILAR BOOKS!
                document.getElementById('similar-books-container').style.display = "none";
                document.getElementById('book-details-text').style.display = "none";


            } else {
                app.innerHTML = "";
                let errorMessage = document.createElement('marquee');
                errorMessage.textContent = `Gah, it's not working!`;
                app.appendChild(errorMessage)
            }
        };
        request.send();


        let eventContainer = document.getElementById('event-container');
        let request2 = new XMLHttpRequest();
        request2.open('GET', getURL() + '/api/event/findByBook?isbn=' + book.isbn, true);
        request2.onload = function () {
            if (request2.status >= 200 && request2.status < 400 && request2.status !== 204) {
                let data = JSON.parse(this.response);
                if(data.length > 0)
                    document.getElementById('event-details-text').setAttribute('class', 'book-details-text');
                data.forEach(event =>{
                    let card = document.createElement('div');
                    card.setAttribute('class', 'author-books-container-card');
                    card.setAttribute('onclick', 'eventsDetailsPage(' + event.eventcode +')');
                    let picture = document.createElement('img');
                    picture.setAttribute('class', 'image-author-book-list');
                    picture.src = '../assets/img/events/' + event.picture;
                    let title = document.createElement('h5');
                    title.textContent = event.name;
                    card.appendChild(picture);
                    card.appendChild(title);
                    eventContainer.appendChild(card);
                });
                loadedEvents = true;
                if(loadedSimilar){
                    setSidebarHeight();
                }
            } else if(request2.status === 204) {
                //NO RELATED EVENTS!
                document.getElementById('event-details-text').style.display = "none";
                document.getElementById('event-container').style.display = "none";


            } else {
                app.innerHTML = "";
                let errorMessage = document.createElement('marquee');
                errorMessage.textContent = `Gah, it's not working!`;
                app.appendChild(errorMessage)
            }
        };
        request2.send();
        setSidebarHeight();
    });
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


let openedNav = true;

function toggleNav() {
    if(openedNav){
        closeNav()
    }else {
        openNav()
    }
}

function closeNav() {
    document.getElementById("mySidebar").style.height="0";
    document.getElementById("sidebarButton").innerHTML = "☰";
    openedNav = false;
}
function openNav() {
    document.getElementById("mySidebar").style.height="auto";
    document.getElementById("sidebarButton").innerHTML = "×";
    openedNav = true;
}

function calculateSaleAmount(listPrice, price){
    return (100*(listPrice - price)/listPrice).toFixed(0);
}
