// get the elements from the page
const form = document.getElementById("itemForm");
const itemList = document.getElementById("itemList");
const expiryCount = document.getElementById("expiryCount");


// get saved items from localStorage
let items = JSON.parse(localStorage.getItem("items")) || [];


// save items in localStorage
function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
}


// find how many days are left
function getDaysLeft(dateText) {
    const today = new Date();
    const expiry = new Date(dateText);

    // set both dates to midnight
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round((expiry - today) / oneDay);
}


// change the date into a simple format
function formatDate(dateText) {
    const date = new Date(dateText);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return date.getDate() + " " +
           months[date.getMonth()] + " " +
           date.getFullYear();
}


// show the correct message for the expiry
function getDaysText(daysLeft) {

    if (daysLeft < 0) {
        return "Expired " + Math.abs(daysLeft) + " days ago";
    }

    if (daysLeft === 0) {
        return "Expires today";
    }

    return daysLeft + " days left";
}


// choose the card color based on days left
function getColorClass(daysLeft) {

    if (daysLeft < 7) {
        return "red";
    }

    if (daysLeft < 30) {
        return "yellow";
    }

    return "green";
}


// count items expiring this month
function countThisMonth() {
    const today = new Date();
    let count = 0;

    for (let i = 0; i < items.length; i++) {

        const expiry = new Date(items[i].expiryDate);

        if (
            expiry.getMonth() === today.getMonth() &&
            expiry.getFullYear() === today.getFullYear()
        ) {
            count++;
        }
    }

    return count;
}


// display all the items
function showItems() {

    itemList.innerHTML = "";

    // sort items by expiry date
    items.sort(function (a, b) {
        return getDaysLeft(a.expiryDate) -
               getDaysLeft(b.expiryDate);
    });


    // show a message if there are no items
    if (items.length === 0) {

        itemList.innerHTML =
            "<p class='empty-text'>No items yet. Add your first one!</p>";
    }


    // create a card for each item
    for (let i = 0; i < items.length; i++) {

        const item = items[i];
        const daysLeft = getDaysLeft(item.expiryDate);


        // create the card
        const card = document.createElement("div");
        card.className = "card " + getColorClass(daysLeft);


        // add item name
        const name = document.createElement("h3");
        name.textContent = item.name;


        // add category
        const category = document.createElement("p");
        category.className = "category";
        category.textContent = item.category;


        // add days left
        const days = document.createElement("p");
        days.className = "days";
        days.textContent = getDaysText(daysLeft);


        // add expiry date
        const expiry = document.createElement("p");
        expiry.textContent =
            "Expires: " + formatDate(item.expiryDate);


        // add details to the card
        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(days);
        card.appendChild(expiry);


        // show purchase date if it was entered
        if (item.purchaseDate) {

            const bought = document.createElement("p");

            bought.textContent =
                "Bought: " + formatDate(item.purchaseDate);

            card.appendChild(bought);
        }


        // create delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        // store the item id in the button
        deleteButton.setAttribute("data-id", item.id);

        card.appendChild(deleteButton);


        // add the card to the page
        itemList.appendChild(card);
    }


    // update the expiry count
    expiryCount.textContent = countThisMonth();
}


// add a new item when the form is submitted
form.addEventListener("submit", function (event) {

    // stop the page from refreshing
    event.preventDefault();


    // create a new item
    const newItem = {

        id: Date.now(),

        name: document.getElementById("name").value,

        category: document.getElementById("category").value,

        purchaseDate:
            document.getElementById("purchaseDate").value,

        expiryDate:
            document.getElementById("expiryDate").value
    };


    // add the item to the list
    items.push(newItem);

    // save the updated list
    saveItems();

    // clear the form
    form.reset();

    // show the updated list
    showItems();
});


// delete an item when the delete button is clicked
itemList.addEventListener("click", function (event) {

    // check if the delete button was clicked
    if (event.target.className === "delete-button") {

        const id =
            Number(event.target.getAttribute("data-id"));


        // ask before deleting
        if (confirm("Delete this item?")) {

            // keep every item except the one being deleted
            items = items.filter(function (item) {
                return item.id !== id;
            });


            // save the updated list
            saveItems();

            // show the updated list
            showItems();
        }
    }
});


// show saved items when the page opens
showItems();
