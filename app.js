let data = loadData();

function getUrgencyClass(daysLeft) {
  if (daysLeft < 7) return "urgent";
  if (daysLeft < 30) return "soon";
  return "safe";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  return day + " " + month + " " + year;
}

function formatDaysLeft(daysLeft) {
  if (daysLeft < 0) return "Expired " + Math.abs(daysLeft) + " days ago";
  if (daysLeft === 0) return "Expires today";
  return daysLeft + " days left";
}

function renderProfiles() {
  const select = document.getElementById("profileSelect");
  select.innerHTML = "";

  Object.keys(data.profiles).forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    if (name === data.activeProfile) option.selected = true;
    select.appendChild(option);
  });
}

function renderRisk() {
  document.getElementById("riskTotal").textContent = getExpiringCountThisMonth(data);
}

function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  const items = data.profiles[data.activeProfile] || [];

  // sort so urgent items show first, then soon, then safe
  const sortedItems = items.slice().sort(function (a, b) {
    return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate);
  });

  sortedItems.forEach(function (item) {
    const daysLeft = getDaysUntilExpiry(item.expiryDate);

    const card = document.createElement("div");
    card.className = "item-card " + getUrgencyClass(daysLeft);

    card.innerHTML =
      '<button class="deleteBtn" data-id="' + item.id + '">✕</button>' +
      '<div class="item-name">' + item.name + "</div>" +
      '<div class="item-days">' + formatDaysLeft(daysLeft) + "</div>";

    card.addEventListener("click", function () {
      openItemDetails(item, daysLeft);
    });

    list.appendChild(card);
  });

  document.querySelectorAll(".deleteBtn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const sure = confirm("Delete this item?");
      if (!sure) return;

      const id = Number(btn.getAttribute("data-id"));
      data = deleteItem(data, id);
      saveData(data);
      renderItems();
      renderRisk();
    });
  });
}

function openItemDetails(item, daysLeft) {
  let purchasedHtml = "";
  if (item.purchaseDate) {
    purchasedHtml = "<p>Bought: " + formatDate(item.purchaseDate) + "</p>";
  }

  let valueHtml = "";
  if (Number(item.value) > 0) {
    valueHtml = "<p>Value: ₹" + item.value + "</p>";
  }

  let notesHtml = "";
  if (item.notes) {
    notesHtml = "<p>Notes: " + item.notes + "</p>";
  }

  let progressHtml = "";
  if (item.purchaseDate) {
    const percent = getProgressPercent(item.purchaseDate, item.expiryDate);
    progressHtml =
      '<div class="progress-bar"><div class="progress-fill ' + getUrgencyClass(daysLeft) +
      '" style="width:' + percent + '%"></div></div>';
  }

  let receiptHtml = "";
  if (item.receiptImage) {
    receiptHtml = '<img src="' + item.receiptImage + '" id="detailReceiptImg">';
  }

  const content = document.getElementById("itemModalContent");
  content.innerHTML =
    "<h3>" + item.name + "</h3>" +
    "<p>Category: " + item.category + "</p>" +
    "<p>Expiry: " + formatDate(item.expiryDate) + " (" + formatDaysLeft(daysLeft) + ")</p>" +
    purchasedHtml +
    valueHtml +
    notesHtml +
    progressHtml +
    receiptHtml +
    "<button id='closeItemModalBtn'>Close</button>";

  document.getElementById("itemModal").classList.remove("hidden");

  document.getElementById("closeItemModalBtn").addEventListener("click", function () {
    document.getElementById("itemModal").classList.add("hidden");
  });

  const receiptImg = document.getElementById("detailReceiptImg");
  if (receiptImg) {
    receiptImg.addEventListener("click", function () {
      document.getElementById("modalImage").src = item.receiptImage;
      document.getElementById("imageModal").classList.remove("hidden");
    });
  }
}

function renderAll() {
  renderProfiles();
  renderRisk();
  renderItems();
}

document.getElementById("profileSelect").addEventListener("change", function (e) {
  data.activeProfile = e.target.value;
  saveData(data);
  renderAll();
});

document.getElementById("addProfileBtn").addEventListener("click", function () {
  const nameInput = document.getElementById("newProfileName");
  const name = nameInput.value.trim();

  if (!name || data.profiles[name]) return;

  data.profiles[name] = [];
  data.activeProfile = name;
  nameInput.value = "";
  saveData(data);
  renderAll();
});

document.getElementById("addItemForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const itemDetails = {
    name: document.getElementById("itemName").value,
    category: document.getElementById("itemCategory").value,
    expiryDate: document.getElementById("itemExpiry").value,
    purchaseDate: document.getElementById("itemPurchase").value,
    value: document.getElementById("itemValue").value,
    notes: document.getElementById("itemNotes").value,
    receiptImage: typeof getReceiptImage === "function" ? getReceiptImage() : null
  };

  data = addItem(data, itemDetails);
  saveData(data);

  e.target.reset();
  if (typeof clearReceiptImage === "function") clearReceiptImage();

  renderAll();
});

document.getElementById("imageModal").addEventListener("click", function () {
  this.classList.add("hidden");
});

document.getElementById("itemModal").addEventListener("click", function (e) {
  if (e.target === this) this.classList.add("hidden");
});

if (typeof initReceiptUpload === "function") initReceiptUpload();
renderAll();