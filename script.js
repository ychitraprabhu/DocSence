// get the elements from the page
const form = document.getElementById("itemForm");
const itemList = document.getElementById("itemList");
const expiryCount = document.getElementById("expiryCount");
const searchBox = document.getElementById("searchBox");
const reminderButton = document.getElementById("reminderButton");


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


// change a date into text like 2025-03-12 (the format date inputs use)
function toDateText(date) {
    return date.getFullYear() + "-" +
           String(date.getMonth() + 1).padStart(2, "0") + "-" +
           String(date.getDate()).padStart(2, "0");
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



// get only the items that match the search text
function getVisibleItems() {

    const text = searchBox.value.trim().toLowerCase();

    // no search text, so show everything
    if (text === "") {
        return items;
    }

    const result = [];

    for (let i = 0; i < items.length; i++) {

        const item = items[i];

        if (
            item.name.toLowerCase().includes(text) ||
            item.category.toLowerCase().includes(text)
        ) {
            result.push(item);
        }
    }

    return result;
}



// display all the items
function showItems() {

    itemList.innerHTML = "";

    // sort items by expiry date
    items.sort(function (a, b) {
        return getDaysLeft(a.expiryDate) -
               getDaysLeft(b.expiryDate);
    });


    // only show the items that match the search
    const visibleItems = getVisibleItems();


    // show a message if there are no items
    if (items.length === 0) {

        itemList.innerHTML =
            "<p class='empty-text'>No items yet. Add your first one!</p>";
    }
    else if (visibleItems.length === 0) {

        itemList.innerHTML =
            "<p class='empty-text'>No items match your search.</p>";
    }


    // create a card for each item
    for (let i = 0; i < visibleItems.length; i++) {

        const item = visibleItems[i];
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


        // create add to calendar button
        const calendarButton = document.createElement("button");

        calendarButton.className = "calendar-button";
        calendarButton.textContent = "Add to Calendar";

        // store the item id in the button
        calendarButton.setAttribute("data-id", item.id);

        card.appendChild(calendarButton);


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



// change the reminder button text
function updateReminderButton() {

    // this browser has no notifications
    if (!("Notification" in window)) {
        reminderButton.style.display = "none";
        return;
    }

    if (Notification.permission === "granted") {
        reminderButton.textContent = "Reminders are on";
    }
    else if (Notification.permission === "denied") {
        reminderButton.textContent = "Reminders blocked in browser settings";
    }
    else {
        reminderButton.textContent = "Enable reminders";
    }
}


// show a notification for items expiring in the next 7 days
function checkReminders() {

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission !== "granted") {
        return;
    }


    // remember which items were already shown today
    const todayText = new Date().toDateString();
    let notified = JSON.parse(localStorage.getItem("notified")) || {};

    if (notified.date !== todayText) {
        notified = { date: todayText, ids: [] };
    }


    for (let i = 0; i < items.length; i++) {

        const item = items[i];
        const daysLeft = getDaysLeft(item.expiryDate);

        // only remind for items expiring today up to 7 days from now
        if (daysLeft < 0 || daysLeft > 7) {
            continue;
        }

        // skip items already shown today
        if (notified.ids.includes(item.id)) {
            continue;
        }

        try {
            new Notification("DocSence", {
                body: item.name + " - " + getDaysText(daysLeft)
            });

            notified.ids.push(item.id);
        } catch (error) {
            // some browsers (like mobile Chrome) do not allow this
        }
    }

    localStorage.setItem("notified", JSON.stringify(notified));
}


// ask for permission when the button is clicked
reminderButton.addEventListener("click", async function () {

    const permission = await Notification.requestPermission();

    updateReminderButton();

    if (permission === "granted") {
        checkReminders();
    }
});



// find an item using its id
function findItem(id) {

    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }

    return null;
}


// download a calendar file (.ics) for the expiry date
function downloadCalendar(item) {

    // dates in the file look like 20250312
    const start = item.expiryDate.replace(/-/g, "");

    // an all day event ends on the next day
    const parts = item.expiryDate.split("-");
    const nextDay = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]) + 1
    );
    const end = toDateText(nextDay).replace(/-/g, "");

    // remove characters that break the file
    const title = item.name.replace(/[,;\n]/g, " ");

    const stamp =
        new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//DocSence//EN",
        "BEGIN:VEVENT",
        "UID:" + item.id + "@docsence",
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + start,
        "DTEND;VALUE=DATE:" + end,
        "SUMMARY:" + title + " expires",
        "BEGIN:VALARM",
        "TRIGGER:-P7D",
        "ACTION:DISPLAY",
        "DESCRIPTION:Expires in 7 days",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
    ];

    // make the file and download it
    const file = new Blob([lines.join("\r\n")], { type: "text/calendar" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = title + "-expiry.ics";
    link.click();

    URL.revokeObjectURL(link.href);
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


// search while typing
searchBox.addEventListener("input", showItems);


// handle the delete and calendar buttons
itemList.addEventListener("click", function (event) {

    // check if the calendar button was clicked
    if (event.target.className === "calendar-button") {

        const id =
            Number(event.target.getAttribute("data-id"));

        const item = findItem(id);

        if (item) {
            downloadCalendar(item);
        }
    }


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

// set up reminders when the page opens
updateReminderButton();
checkReminders();
