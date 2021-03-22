let buttons = document.querySelectorAll(".menu__item");
let main = document.querySelector(".main__section");
let pagination = document.querySelector(".pagination");
let listItems = document.querySelector(".list__items");
let input = document.querySelector(".input");
let submit = document.querySelector(".submit");





const URL = "https://swapi.dev/api/";

submit.addEventListener("click", (evt) => {
        evt.preventDefault();
        let search = input.value.toLowerCase();
        fetch(`${URL}people/?search=${search}`).then(response => response.json())
            .then(data => showInfo(data.results))
    }) // на кнопку сабміту вішаємо івент. Однак я не зрозумів, як по цілому сайті зробити пошук ????? 


buttons.forEach(e =>
        e.addEventListener("click", (evt) => {
            let path = evt.currentTarget.id;
            fetch(`${URL}${path}`).then(response => response.json())
                .then(data => showInfo(data.results))
        })
    ) //на кожну кнопку меню вішаємо івент, в якому посилаємо запит 

fetch(`${URL}films`).then(response => response.json())
    .then(data => showInfo(data.results)); // щоб сторінка не була пуста, перший раз загружаємо вручну .



function showInfo(data) {
    let items = [];
    const ITEMS_ON_PAGE = 4;

    let pages = Math.ceil(data.length / ITEMS_ON_PAGE);
    pagination.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
        let li = document.createElement("li");
        li.innerHTML = i;
        pagination.append(li);
        items.push(li);
    }

    if (items.length == 1) {
        pagination.innerHTML = "";
    }
    drawElements(1, data);

    for (let i = 0; i < items.length; i++) {

        items[i].addEventListener("click", (evt) => {
            let pageNum = +evt.currentTarget.innerHTML;
            drawElements(pageNum, data)
        })
    } // на кожну кнопку пагінації вішаємо івент, щоб перейти на відповідну сторінку
}

function drawElements(page, data) {

    if (data.length < 2) {
        listItems.innerHTML = "";
        let item = document.createElement("div");
        item.classList.add("list__item");

        for (let key in data[0]) {
            let subparagraph = document.createElement("p");

            let type = typeof(data[0][key]);
            if (type != 'object') {
                subparagraph.innerHTML = `${key}:${data[0][key]}`;
                item.append(subparagraph)
            }
        }


        listItems.append(item)

    } else {

        const ITEMS_ON_PAGE = 4;
        let start = (page - 1) * ITEMS_ON_PAGE;
        let end = start + ITEMS_ON_PAGE;
        let notes = data.slice(start, end);
        listItems.innerHTML = '';
        for (let i = 0; i < notes.length; i++) {

            let item = document.createElement("div");
            item.classList.add("list__item");
            let btn = document.createElement("div");
            btn.classList.add("btn__info");
            btn.innerHTML = "Show info";
            btn.addEventListener("click", () => {
                showItemInfo(notes[i])
            })

            let li = document.createElement("li");
            if (!notes[i]['name']) {
                li.innerHTML = notes[i].title
            } else {
                li.innerHTML = notes[i].name;
            }

            item.append(li);
            item.append(btn)
            listItems.append(item)


        }

    }
}

function showItemInfo(item) {

    let modal = document.querySelector(".item__info");

    modal.classList.add("active");

    let btnClose = document.createElement("div");
    btnClose.classList.add("btn__close");
    btnClose.innerHTML = "close";
    modal.prepend(btnClose);

    for (let key in item) {
        let subparagraph = document.createElement("p");

        let type = typeof(item[key]);
        if (type != 'object') { // щоб не проходити ще раз по вкладених обєктах, просто вирішив їх не показувати)) 
            subparagraph.innerHTML = `${key}:${item[key]}`;
            modal.append(subparagraph)
        }
    }

    btnClose.addEventListener("click", () => {
        modal.innerHTML = '';
        modal.classList.remove("active");
    })




}
