// get the things we need from the page
var form = document.getElementById("itemForm");
var itemList = document.getElementById("itemList");
var monthCount = document.getElementById("monthCount");

// load saved items from the browser (or start with an empty list)
var items = JSON.parse(localStorage.getItem("docsenceItems")) || [];

// save the items list in the browser
function saveItems() {
    localStorage.setItem("docsenceItems", JSON.stringify(items));
}

// find how many days are left until a date
function getDaysLeft(dateText) {
    var today = new Date();
    var expiry = new Date(dateText);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    var oneDay = 1000 * 60 * 60 * 24;
    return Math.round((expiry - today) / oneDay);
}

// turn a date like 2026-10-05 into 5 Oct 2026
function formatDate(dateText) {
    var date = new Date(dateText);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
}

// write the days left message
function getDaysText(daysLeft) {
    if (daysLeft < 0) {
        return "Expired " + Math.abs(daysLeft) + " days ago";
    }
    if (daysLeft === 0) {
        return "Expires today";
    }
    return daysLeft + " days left";
}

// pick a color class: red if less than 7 days, yellow if less than 30, else green
function getColorClass(daysLeft) {
    if (daysLeft < 7) {
        return "red";
    }
    if (daysLeft < 30) {
        return "yellow";
    }
    return "green";
}

// count how many items expire in the current month
function countThisMonth() {
    var today = new Date();
    var count = 0;

    for (var i = 0; i < items.length; i++) {
        var expiry = new Date(items[i].expiryDate);
        if (expiry.getMonth() === today.getMonth() && expiry.getFullYear() === today.getFullYear()) {
            count++;
        }
    }

    return count;
}

// show all items on the page
function showItems() {
    itemList.innerHTML = "";

    // put the items that expire first at the top
    items.sort(function (a, b) {
        return getDaysLeft(a.expiryDate) - getDaysLeft(b.expiryDate);
    });

    // message when there are no items
    if (items.length === 0) {
        itemList.innerHTML = "<p class='empty-text'>No items yet. Add your first one!</p>";
    }

    // make one card for each item
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var daysLeft = getDaysLeft(item.expiryDate);

        var card = document.createElement("div");
        card.className = "card " + getColorClass(daysLeft);

        var name = document.createElement("h3");
        name.textContent = item.name;

        var category = document.createElement("p");
        category.className = "category";
        category.textContent = item.category;

        var days = document.createElement("p");
        days.className = "days";
        days.textContent = getDaysText(daysLeft);

        var expiry = document.createElement("p");
        expiry.textContent = "Expires: " + formatDate(item.expiryDate);

        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(days);
        card.appendChild(expiry);

        // only show purchase date if the user typed one
        if (item.purchaseDate) {
            var bought = document.createElement("p");
            bought.textContent = "Bought: " + formatDate(item.purchaseDate);
            card.appendChild(bought);
        }

        // delete button
        var deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", item.id);
        card.appendChild(deleteButton);

        itemList.appendChild(card);
    }

    monthCount.textContent = countThisMonth();
}

// when the form is submitted, add a new item
form.addEventListener("submit", function (event) {
    event.preventDefault();

    var newItem = {
        id: Date.now(),
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        purchaseDate: document.getElementById("purchaseDate").value,
        expiryDate: document.getElementById("expiryDate").value
    };

    items.push(newItem);
    saveItems();
    form.reset();
    showItems();
});

// when a delete button is clicked, remove that item
itemList.addEventListener("click", function (event) {
    if (event.target.className === "delete-button") {
        var id = Number(event.target.getAttribute("data-id"));

        if (confirm("Delete this item?")) {
            items = items.filter(function (item) {
                return item.id !== id;
            });
            saveItems();
            showItems();
        }
    }
});

// show the items when the page opens
showItems();